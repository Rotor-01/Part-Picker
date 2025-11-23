import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../src/pages/AIBuild.tsx';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY as string);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { conversation, systemPrompt } = request.body;

  if (!conversation || !systemPrompt) {
    return response.status(400).json({ error: 'Missing required body parameters.' });
  }

  try {
    let aiResponse: string | null = '';
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'OK.' }] },
        ...conversation.map((c: Message) => ({
          role: c.role === 'user' ? 'user' : 'model',
          parts: [{ text: c.content }],
        })),
      ],
    });
    const result = await chat.sendMessage(
      conversation[conversation.length - 1].content,
    );
    const geminiResponse = result.response;
    aiResponse = geminiResponse.text();

    return response.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}