export default async function handler(req, res) {
  // Gestisce solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { message, lang } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Controllo se la chiave è configurata su Vercel
  if (!apiKey) {
    return res.status(500).json({ error: 'Chiave API non configurata su Vercel' });
  }

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
        max_tokens: 300,
        messages: [{ 
          role: "user", 
          content: `Sei ${lang === 'en' ? 'Lily' : 'Lola'}. Parla con Zoe (livello A2). Se Zoe commette errori grammaticali, correggila sempre dicendo "Did you mean: [correzione]?" e poi continua il dialogo. Sii amichevole e incoraggiante. Messaggio di Zoe: ${message}` 
        }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: "Errore di rete o server" });
  }
}
