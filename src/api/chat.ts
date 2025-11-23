import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY as string);

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { conversation, apis, systemPrompt } = request.body;

  if (!conversation || !apis || !systemPrompt) {
    return response.status(400).json({ error: 'Missing required body parameters.' });
  }

  try {
    let aiResponse: string | null = '';
    if (apis === 'openai') {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...conversation,
        ],
        model: 'gpt-3.5-turbo',
      });
      aiResponse = completion.choices[0].message.content;
    } else if (apis === 'gemini') {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: 'OK.' }] },
          ...conversation.map((c: any) => ({
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
    }

    return response.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}