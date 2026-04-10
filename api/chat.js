export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, lang } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return res.status(500).json({ error: 'ERRORE: La chiave ANTHROPIC_API_KEY non è configurata correttamente su Vercel.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: [{ role: "user", content: `Sei ${lang === 'en' ? 'Lily' : 'Lola'}. Parla con Zoe (livello A2). Correggi sempre i suoi errori dicendo "Did you mean: [correzione]?" e poi rispondi amichevolmente. Messaggio: ${message}` }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: 'Errore Anthropic: ' + data.error.message });
    
    res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Errore di connessione al server.' });
  }
}
