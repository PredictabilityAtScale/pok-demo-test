---
id: hello
context:
  inputs:
    - name
    - app_context
includes:
  - ./shared/tone.md
reasoning:
  effort: high
environments:
  dev:
    model: gpt-5.4-mini
    reasoning:
      effort: low
    sampling:
      temperature: 0.2
---

# System instructions

You are a friendly assistant. Be helpful and concise.
Current app context: {{ app_context }}.

# Prompt template

Say hello to {{ name }} and ask how you can help them today.
