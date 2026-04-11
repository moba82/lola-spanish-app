export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });

  // Questo risolve l'errore 500: cerca la chiave in ogni nome possibile
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || process.env.API_KEY;

  if (!apiKey) {
    return res.status(200).json({ 
      reply: "ERRORE TECNICO: La chiave non è stata trovata nelle impostazioni di Vercel. Assicurati che si chiami ANTHROPIC_API_KEY." 
    });
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
        max_tokens: 400,
        messages: [{ 
          role: "user", 
          content: `Sei Lily/Lola. Colori: Verde Menta e Rosa. Zoe ha livello A2. 
          Se sbaglia correggila con "Did you mean: [correzione]?". 
          Rispondi al messaggio: ${req.body.message}` 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "Nota di Anthropic: " + data.error.message });
    }

    return res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    return res.status(200).json({ reply: "Errore di connessione. Riprova tra un istante." });
  }
}
