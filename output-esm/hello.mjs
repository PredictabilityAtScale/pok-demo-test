export default {
  "id": "hello",
  "schema_version": 1,
  "reasoning": {
    "effort": "high"
  },
  "context": {
    "inputs": [
      "name",
      "app_context"
    ]
  },
  "environments": {
    "dev": {
      "model": "gpt-5.4-mini",
      "reasoning": {
        "effort": "low"
      },
      "sampling": {
        "temperature": 0.2
      }
    }
  },
  "sections": {
    "system_instructions": "Always be polite, professional, and concise. Avoid jargon unless the user uses it first.\n\nYou are a friendly assistant. Be helpful and concise.\nCurrent app context: {{ app_context }}.",
    "prompt_template": "Say hello to {{ name }} and ask how you can help them today."
  },
  "source": {
    "file_path": "prompts\\hello.md"
  },
  "provider": "openai",
  "model": "gpt-5.4",
  "metadata": {
    "owner": "my-team",
    "review_required": true
  }
};
