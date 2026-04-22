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
      trim: both
      allow_regex:
        pattern: '\S'
      deny_regex:
        pattern: '(secret|api[_-]?key|password)'
        flags: 'i'
        return_message: "A secret was detected."
---

# System instructions

You are a code review assistant. Summarize pull requests concisely and clearly.

# Prompt template

Summarize the following pull request:

{{ pull_request_body }}

# Notes

This example demonstrates input hardening with byte trimming plus structured regular expressions, including an explicit case-insensitive flag for the denylist.