export default async function handler(req, res) {
  const { message, type, topic } = req.body;

  const interessiZoe = "musica, clarinetto, equitazione, cavalli, amiche, scout, scuola, famiglia, cibo";
  
  let systemPrompt = `Sei Lola, una ragazza spagnola di 15 anni, amica e tutor di Zoe (12 anni). Livello A2.
  Interessi di Zoe: ${interessiZoe}.`;
  
  if (type === "reading") {
    systemPrompt += ` Genera una BREVE storia inedita (max 5 righe) in spagnolo che coinvolga Zoe e i suoi interessi (es. una gara di equitazione, un concerto di clarinetto o un'uscita scout).
    Poi crea una domanda e 3 opzioni (A, B, C) con la risposta corretta.
    Rispondi SOLO in formato JSON: {"story": "...", "question": "...", "options": ["...", "...", "..."], "answerIndex": 0}`;
  } else {
    systemPrompt += ` Conversa con Zoe. Sii amichevole e usa i suoi interessi per stimolare il dialogo. 
    RECOLA: Se Zoe commette errori, correggila sempre con "¿Querías decir...?" prima di rispondere.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: message || "¡Hola Lola! Cuéntame una historia." }]
    })
  });

  const data = await response.json();
  const content = data.content[0].text;
  
  if (type === "reading") {
    res.status(200).json(JSON.parse(content));
  } else {
    res.status(200).json({ reply: content });
  }
}
