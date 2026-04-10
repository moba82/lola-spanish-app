export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { message, lang } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 400,
        messages: [{ role: "user", content: `Sei ${lang === 'en' ? 'Lily' : 'Lola'}. Parla con Zoe (livello A2). Usa il verde menta e rosa come colori nel cuore. Se sbaglia, correggila con "Did you mean: [correzione]?" Messaggio: ${message}` }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(200).json({ reply: "Errore Anthropic: " + data.error.message });
    
    res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    res.status(200).json({ reply: "Errore di connessione server." });
  }
}
