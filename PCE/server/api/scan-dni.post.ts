import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineEventHandler, readBody, createError, getHeader } from "h3";

// ✅ SECURITY: Simple in-memory rate limiter per IP
const dniScanAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
    const now = Date.now();
    const limit = 10; // Max 10 requests per hour
    const windowMs = 60 * 60 * 1000; // 1 hour

    const record = dniScanAttempts.get(ip);
    if (!record || now > record.resetTime) {
        dniScanAttempts.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= limit) {
        console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
        return false;
    }

    record.count++;
    return true;
}

export default defineEventHandler(async (event) => {
    try {
        // ✅ SECURITY: Rate limiting
        const clientIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown';
        if (!checkRateLimit(clientIp as string)) {
            throw createError({
                statusCode: 429,
                statusMessage: 'Too many requests. Max 10 scans per hour.'
            });
        }

        const { image, mimeType } = await readBody(event);

        // ✅ SECURITY: Validate input
        if (!image) {
            throw createError({
                statusCode: 400,
                statusMessage: "No image data provided",
            });
        }

        // ✅ SECURITY: Validate image size (max 5MB)
        const imageSizeInBytes = Buffer.byteLength(image);
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        
        if (imageSizeInBytes > maxSizeInBytes) {
            throw createError({
                statusCode: 400,
                statusMessage: `Image too large. Max 5MB, got ${(imageSizeInBytes / 1024 / 1024).toFixed(2)}MB`
            });
        }

        // ✅ SECURITY: Validate mime type
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const finalMimeType = mimeType || 'image/jpeg';
        if (!allowedMimes.includes(finalMimeType)) {
            throw createError({
                statusCode: 400,
                statusMessage: `Invalid image format. Allowed: ${allowedMimes.join(', ')}`
            });
        }

        const config = useRuntimeConfig();
        const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('🔑 Gemini API Key not configured');
            throw createError({
                statusCode: 500,
                statusMessage: "DNI scanning service not available",
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
      Analiza esta imagen de un DNI/NIE español y extrae los siguientes datos en formato JSON puro:
      {
        "dni": "Número de DNI o NIE con letra",
        "nombre": "Nombre de pila",
        "apellidos": "Apellidos completos",
        "fecha_nacimiento": "Fecha de nacimiento en formato DD/MM/AAAA",
        "fecha_caducidad": "Fecha de validez/caducidad en formato DD/MM/AAAA"
      }
      
      Si no puedes encontrar algún dato, déjalo como null.
      Responde SOLO el JSON, sin bloques de código Markdown ni texto adicional.
    `;

        const contents = [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: finalMimeType,
                            data: image,
                        },
                    },
                    { text: prompt },
                ],
            },
        ];

        const result = await model.generateContent({ contents });
        const response = await result.response;
        const text = response.text();

        // ✅ SECURITY: Sanitize response - remove markdown blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const structuredData = JSON.parse(cleanedText);

        // ✅ SECURITY: Log successful extraction (without exposing full DNI)
        console.log(`✅ DNI scanned successfully from IP: ${clientIp}`);

        return structuredData;
    } catch (error: any) {
        console.error("❌ Error in scan-dni API:", error.message);
        
        if (error.statusCode === 429 || error.statusCode === 400 || error.statusCode === 500) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: "Error processing DNI image",
            data: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
