import { GoogleGenerativeAI } from "@google/generative-ai";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
    try {
        const { image, mimeType } = await readBody(event);

        if (!image) {
            throw createError({
                statusCode: 400,
                statusMessage: "No image data provided",
            });
        }

        const config = useRuntimeConfig();
        const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw createError({
                statusCode: 500,
                statusMessage: "Gemini API Key not configured",
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-3-flash-preview as requested/tested
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
                            mimeType: mimeType || "image/jpeg",
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

        console.log("Gemini Raw Response:", text);

        // Clean response in case the model included markdown blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const structuredData = JSON.parse(cleanedText);

        return structuredData;
    } catch (error: any) {
        console.error("Error in scan-dni API:", error);
        throw createError({
            statusCode: 500,
            statusMessage: "Error processing DNI image with AI",
            data: error.message,
        });
    }
});
