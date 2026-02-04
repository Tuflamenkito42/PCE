/**
 * Configuration for Xenova Transformers
 * This file configures caching and model loading for better performance
 */

// Configure the transformers library to use browser cache
export const configureTransformers = async () => {
    const { env } = await import('@xenova/transformers');

    // Use local cache for models (stored in browser IndexedDB)
    env.allowLocalModels = true;
    env.allowRemoteModels = true;

    // Use CDN for faster model loading
    env.backends.onnx.wasm.numThreads = 1; // Use single thread for stability

    return env;
}

/**
 * Model configurations
 */
export const MODELS = {
    OCR: {
        // TrOCR model for printed text (smaller and faster)
        name: 'Xenova/trocr-small-printed',
        task: 'image-to-text',
        description: 'Optimized for printed documents like DNI'
    }
}
