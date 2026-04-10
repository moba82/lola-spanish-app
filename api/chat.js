export default async function handler(req, res) {
  const { message, topic } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 150,
      system: `Sei Lola, una tutor di spagnolo simpatica per una bambina di nome Zoe. 
               Livello: A2. Lingua: Spagnolo. 
               Argomento attuale: ${topic}. 
               RECOLA FONDAMENTALE: Se Zoe commette un errore grammaticale o usa la parola sbagliata, 
               rispondi gentilmente dicendo sempre "Did you mean: [correzione]?" o "¿Querías decir: ...?" 
               prima di continuare la conversazione. Sii incoraggiante.`,
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  res.status(200).json({ reply: data.content[0].text });
}
