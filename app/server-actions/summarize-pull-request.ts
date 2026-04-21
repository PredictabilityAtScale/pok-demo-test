"use server";

import path from "node:path";
import OpenAI from "openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { openaiAdapter } from "promptopskit/openai";

function formatPreview(value: string, maxLength = 1600) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}\n…` : value;
}

export async function summarizePullRequestAction(
  environment: string,
  pullRequestBody: string,
): Promise<{ model: string; requestBodyPreview: string; summary: string }> {
    
  // 1 - use the OpenAI adapter to render the prompt and get the request body that would be sent to the OpenAI API
  const request = await openaiAdapter.renderPrompt(
    {
      path: "summarizePullRequest",
      sourceDir: path.join(process.cwd(), "prompts"), // the folder with the markdown prompts
      compiledDir: path.join(process.cwd(), "output-esm"), // or output-json prompts after `npx promptopskit compile` command
      mode: "auto",
    },
    {
      environment,
      variables: {
        pull_request_body: pullRequestBody,
      },
      strict: true,
    },
  );

  // 2 - create an OpenAI API client and send the request body as a chat completion request to the OpenAI API
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create(
    request.body as unknown as ChatCompletionCreateParamsNonStreaming,
  );

  return {
    model: completion.model,
    requestBodyPreview: formatPreview(JSON.stringify(request.body, null, 2)),
    summary: completion.choices[0]?.message?.content?.trim() ?? "",
  };
}

export async function buildSummarizePullRequestPreview(
  environment: string,
  pullRequestBody: string,
) {
  const request = await openaiAdapter.renderPrompt(
    {
      path: "summarizePullRequest",
      sourceDir: path.join(process.cwd(), "prompts"),
      compiledDir: path.join(process.cwd(), "output-esm"),
      mode: "auto",
    },
    {
      environment,
      variables: {
        pull_request_body: pullRequestBody,
      },
      strict: true,
    },
  );

  return {
    request,
    requestBodyPreview: formatPreview(JSON.stringify(request.body, null, 2)),
  };
}
