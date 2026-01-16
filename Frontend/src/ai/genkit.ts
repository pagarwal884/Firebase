import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';


/**
 * Initialize Genkit with Google AI plugin
 * Make sure to set GOOGLE_GENAI_API_KEY in your .env file
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  // Set default model for generate() calls
  model: 'googleai/gemini-2.0-flash-exp',
});