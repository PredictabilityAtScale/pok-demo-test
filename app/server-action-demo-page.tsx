import { readFile } from "node:fs/promises";
import path from "node:path";
import { fakePullRequestBody } from "@/app/server-action-demo-data";
import { ServerActionDemo } from "@/app/server-action-demo";
import { buildSummarizePullRequestPreview } from "@/app/server-actions/summarize-pull-request";

async function loadPromptMarkdownSource(): Promise<string> {
  return readFile(path.join(process.cwd(), "prompts", "summarizePullRequest.md"), "utf8");
}

export async function ServerActionDemoPage() {
  const [promptMarkdownSource, preview] = await Promise.all([
    loadPromptMarkdownSource(),
    buildSummarizePullRequestPreview("prod", fakePullRequestBody),
  ]);

  return (
    <ServerActionDemo
      promptMarkdownSource={promptMarkdownSource}
      initialOpenAiBodyPreview={preview.requestBodyPreview}
    />
  );
}