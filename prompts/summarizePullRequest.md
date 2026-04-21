---
id: summarizePullRequest
schema_version: 1
environments:
  dev:
    model: gpt-5.4-mini
context:
  inputs:
    - name: pull_request_body
      max_size: 8000
---

# System instructions

You are a code review assistant. Summarize pull requests concisely and clearly.

# Prompt template

Summarize the following pull request:

{{ pull_request_body }}