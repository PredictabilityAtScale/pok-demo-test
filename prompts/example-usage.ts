// Example: render the hello prompt and send it to OpenAI
// Full docs: https://promptopskit.com/docs/index.html#/

import { createPromptOpsKit } from 'promptopskit';

async function main() {
  const kit = createPromptOpsKit({ sourceDir: './prompts' });

  // Determine environment from ENV var (defaults to 'dev')
  // - dev: uses gpt-5.4-mini, low reasoning effort, temperature 0.2
  // - production: uses base model gpt-5.4 with high reasoning effort
  const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

  const { request } = await kit.renderPrompt({
    path: 'hello',
    provider: 'openai',
    environment,
    variables: {
      name: 'World',
      app_context: 'Welcome screen',
    },
  });

    /*
    request.body is the fully transformed OpenAI Chat Completions payload.
    For the hello.md prompt in the dev environment it looks like:

    {
      "model": "gpt-5.4-mini",
      "reasoning_effort": "low",
      "temperature": 0.2,
      "messages": [
        {
          "role": "system",
          "content": "You are a friendly assistant. Be helpful and concise.
  Current app context: Welcome screen.

  Always be polite, professional, and concise. Avoid jargon unless the user uses it first."
        },
        {
          "role": "user",
          "content": "Say hello to World and ask how you can help them today."
        }
      ]
    }
    */

  console.log('Model:', request.body.model);

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(request.body),
  });

  const data = await res.json();
  console.log(data.choices[0].message.content);
}

main();
