import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!process.env.GEMINI_API_KEY) {
    return response.status(500).json({ error: 'GEMINI_API_KEY is not set.' });
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { conversation, systemPrompt } = request.body;

  if (!conversation || !systemPrompt) {
    return response.status(400).json({ error: 'Missing required body parameters.' });
  }

  try {
    let aiResponse: string | null = '';
    // Use v1 API version which should support gemini-1.5-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }, {
      apiVersion: 'v1'
    });

    const history = conversation.slice(0, -1);
    const lastMessage = conversation[conversation.length - 1];

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'OK.' }] },
        ...history.map((c: Message) => ({
          role: c.role === 'user' ? 'user' : 'model',
          parts: [{ text: c.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(lastMessage.content);
    const geminiResponse = result.response;
    aiResponse = geminiResponse.text();

    if (!aiResponse) {
      return response.status(500).json({ error: 'The AI returned an empty response.' });
    }

    try {
      JSON.parse(aiResponse);
    } catch (e) {
      console.error('AI response is not valid JSON:', aiResponse);
      return response.status(500).json({
        error:
          'The AI returned an invalid response. Please try again.',
      });
    }

    return response.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}