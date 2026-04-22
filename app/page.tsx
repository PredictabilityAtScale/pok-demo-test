import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import { openaiAdapter } from "promptopskit/openai";
import { MainPageClient } from "@/app/main-page-client";

async function loadPromptMarkdownSource(): Promise<string> {
  return readFile(path.join(process.cwd(), "prompts", "summarizePullRequest.md"), "utf8");
}

export default async function Home() {
  const promptMarkdownSource = await loadPromptMarkdownSource();

  async function summarizePullRequestAction(
    environment: string,
    pullRequestBody: string,
  ): Promise<{ model: string; requestBodyPreview: string; summary: string }> {
    "use server";

    const request = await openaiAdapter.renderPrompt(
      {
        path: "summarizePullRequest",
      },
      {
        environment,
        variables: {
          pull_request_body: pullRequestBody,
        },
        strict: true,
      },
    );

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create(
      request.body as unknown as ChatCompletionCreateParamsNonStreaming,
    );

    return {
      model: completion.model,
      requestBodyPreview: JSON.stringify(request.body, null, 2),
      summary: completion.choices[0]?.message?.content?.trim() ?? "",
    };
  }

  return (
    <MainPageClient
      promptMarkdownSource={promptMarkdownSource}
      summarizePullRequestAction={summarizePullRequestAction}
    />
  );
}
