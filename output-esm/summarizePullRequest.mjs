export default {
  "id": "summarizePullRequest",
  "schema_version": 1,
  "context": {
    "inputs": [
      {
        "name": "pull_request_body",
        "max_size": 8000
      }
    ]
  },
  "environments": {
    "dev": {
      "model": "gpt-5.4-mini"
    }
  },
  "sections": {
    "system_instructions": "You are a code review assistant. Summarize pull requests concisely and clearly.",
    "prompt_template": "Summarize the following pull request:\n\n{{ pull_request_body }}"
  },
  "source": {
    "file_path": "prompts\\summarizePullRequest.md"
  },
  "provider": "openai",
  "model": "gpt-5.4",
  "metadata": {
    "owner": "my-team",
    "review_required": true
  }
};
