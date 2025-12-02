import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = 'https://api.twitterapi.io/twitter/user/last_tweets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const handle = (req.query.handle as string | undefined)?.replace(/^@/, '').trim();

  if (!handle) {
    res.status(400).json({ error: 'Missing handle query parameter' });
    return;
  }

  const apiKey = process.env.TWITTERAPI_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'Missing TWITTERAPI_KEY env variable' });
    return;
  }

  const endpoint = `${API_BASE}?userName=${encodeURIComponent(handle)}&limit=20`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      res
        .status(response.status)
        .json({ error: 'Twitter API request failed', details: errorText });
      return;
    }

    const payload = await response.json();

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      error: 'Unexpected error contacting twitterapi.io',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


