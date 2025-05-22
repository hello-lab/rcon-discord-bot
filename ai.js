
require('dotenv').config();

async function getFixedCommand(userCommand) {
  const { GoogleGenAI } = await import('@google/genai');

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      required: ['help_text', 'command'],
      properties: {
        help_text: { type: 'string' },
        command: { type: 'string' },
      },
    },
    systemInstruction: [
        {
          text: 'you will either get a wrong cs:go server/source_mod command or the user asking for the command for a task. In the help_text property you shall provide a help statement saying what the user might mean and suggest the correct command. in the command property you shall return only the command',
        }
    ],
  };
  const model = 'gemini-2.0-flash';
  const contents = [
    
    {
      role: 'user',
      parts: [
        {
          text: userCommand,
        },
      ],
    },
  ];

 

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = '';
  for await (const chunk of response) {
    result += chunk.text;
  }

  return result;
}

module.exports = getFixedCommand;
