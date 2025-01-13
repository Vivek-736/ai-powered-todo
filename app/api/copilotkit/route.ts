import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const userInput = messages[messages.length - 1].content;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyA09Heo4lvW8gxAib3i8QaYihnkW9ZzgTI`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: userInput,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const botResponse =
      geminiData.candidates[0]?.content?.parts[0]?.text || 'No response available.';

    return NextResponse.json({ message: botResponse });
  } catch (error) {
    console.error('Error in /api/copilotkit/route.ts:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}