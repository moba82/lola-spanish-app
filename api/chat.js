export default async function handler(req, res) {
  // 1. Controllo che la richiesta sia corretta
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  // 2. Recupero la chiave che abbiamo visto nella tua foto
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: "Errore: Vercel non passa la chiave. Prova a rifare il Redeploy." });
  }

  try {
    // 3. Chiamata diretta ad Anthropic (senza librerie esterne)
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
          content: `Sei Lily/Lola. Colori: Verde Menta e Rosa. Zoe ha livello A2. Se sbaglia correggila con "Did you mean: [correzione]?". Messaggio: ${req.body.message}` 
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: "Nota di Anthropic: " + data.error.message });
    }

    // 4. Invio la risposta a Zoe
    return res.status(200).json({ reply: data.content[0].text });

  } catch (error) {
    return res.status(200).json({ reply: "Errore tecnico di rete. Riprova tra 10 secondi." });
  }
}
