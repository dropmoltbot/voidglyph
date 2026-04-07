import { NextRequest } from 'next/server';

const HERMES_API = process.env.HERMES_API_URL || 'http://127.0.0.1:8642/v1';
const API_KEY = '09c817ebb7ab494dff88ab1d79dd439d09d9a7db19b31966f6560f101ebbab83';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages } = body;

    const hermesRes = await fetch(`${HERMES_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!hermesRes.ok) {
      const err = await hermesRes.text();
      return new Response(`Hermes API error: ${err}`, { status: hermesRes.status });
    }

    return new Response(hermesRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
