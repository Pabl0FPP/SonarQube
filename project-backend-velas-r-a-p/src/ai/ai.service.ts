import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cloudinary } from '../cloudinary/cloudinary.config';
import axios from 'axios';

interface OpenAIImageResponse {
  data: Array<{
    url: string;
  }>;
}

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    const API_KEY = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  /**
   * Generates a creative, poetic, and highly personalized message for a candle using Google Gemini AI.
   * The message is always returned in Spanish, with a maximum of 30 words, and tailored to the user's prompt.
   * @param prompt Context or idea for the personalized candle message.
   * @returns {Promise<string>} The generated message as a string.
   */
  async generateMessage(prompt: string): Promise<any> {
    const systemPrompt = `
        Eres un experto en crear mensajes memorables y significativos para velas personalizadas. Tu objetivo es transformar ideas simples en frases impactantes que combinen creatividad con sinceridad y significado real.

        INSTRUCCIONES:
        1. Responde ÚNICAMENTE con el mensaje final, sin explicaciones adicionales ni opciones alternativas.
        2. El mensaje debe tener un máximo de 30 palabras.
        3. Usa lenguaje poético, metáforas relacionadas con luz y calor, y juegos de palabras cuando sea apropiado.
        4. Sé ALTAMENTE CREATIVO - utiliza analogías sorprendentes, imágenes vívidas y expresiones originales.
        5. Personaliza el mensaje según la emoción o intención que detectes en el prompt (amor, amistad, motivación, etc.).
        6. NO incluyas conteos de palabras, descripciones del tono, ni ningún tipo de metadatos.
        7. El mensaje SIEMPRE debe estar en español, independientemente del idioma que yo use para describir el contexto.`;

    const chat = this.model.startChat({
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 100,
        topK: 40,
        topP: 0.95,
      },
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Esperando tu solicitud para crear un mensaje optimizado en español.' }],
        },
      ],
    });

    const result = await chat.sendMessage(`Sugiere un mensaje para una vela personalizada basado en: "${prompt}"`);
    return result.response.text();
  }

   /**
   * Generates an image based on a prompt using OpenAI and uploads it to Cloudinary.
   * @param prompt Description for the image to generate.
   * @returns {Promise<string>} The Cloudinary URL of the generated image.
   */
  async generateImageWithOpenAI(prompt: string): Promise<string> {
    // Generate image with OpenAI
    const openaiResponse = await axios.post('https://api.openai.com/v1/images/generations', 
      {
        prompt,
        n: 1,
        size: "512x512"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      }
    );

    const data = openaiResponse.data as OpenAIImageResponse;
    if (!data?.data?.[0]?.url) {
      throw new Error('No se pudo generar la imagen');
    }

    // Download the image from OpenAI
    const imageUrl = data.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'files' },
        (error, result) => {
          if (error) {
            let errorMessage: string;
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'object') {
              errorMessage = JSON.stringify(error);
            } else {
              errorMessage = String(error);
            }
            return reject(new Error(errorMessage));
          }
          resolve(result);
        },
      );
      uploadStream.end(imageBuffer);
    });

    return (uploadResult as any).secure_url;
  }
}