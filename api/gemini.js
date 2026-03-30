export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const GEMINI_KEY = process.env.VITE_GEMINI_KEY;

    if (!GEMINI_KEY) {
      return res.status(500).json({ error: 'API key not set' });
    }

    const body = req.body; 

    const response = await fetch('https://api.gemini.ai/v1/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}