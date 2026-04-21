'use client';

import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import {
  buildSummarizePullRequestPreview,
  summarizePullRequestAction,
} from "@/app/server-actions/summarize-pull-request";
import { fakePullRequestBody } from "@/app/server-action-demo-data";
import compiledSummarizePullRequestPrompt from "@/output-esm/summarizePullRequest.mjs";

function formatPreview(value: string, maxLength = 1200) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}\n…` : value;
}

type ServerActionDemoProps = {
  promptMarkdownSource: string;
  initialOpenAiBodyPreview: string;
};

export function ServerActionDemo({
  promptMarkdownSource,
  initialOpenAiBodyPreview,
}: ServerActionDemoProps) {
  const [pullRequestBody, setPullRequestBody] = useState(fakePullRequestBody);
  const [environment, setEnvironment] = useState("prod");
  const [summary, setSummary] = useState("");
  const [model, setModel] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [openAiBodyPreview, setOpenAiBodyPreview] = useState(initialOpenAiBodyPreview);
  const deferredPullRequestBody = useDeferredValue(pullRequestBody);
  const latestPreviewRequest = useRef(0);

  const compiledPromptPreview = formatPreview(
    JSON.stringify(compiledSummarizePullRequestPrompt, null, 2),
    1600,
  );
  const resultPreview = summary || "The summary result will appear here after the server action returns.";

  useEffect(() => {
    const requestId = latestPreviewRequest.current + 1;
    latestPreviewRequest.current = requestId;

    async function refreshPreview() {
      const preview = await buildSummarizePullRequestPreview(environment, deferredPullRequestBody);

      if (latestPreviewRequest.current !== requestId) {
        return;
      }

      startTransition(() => {
        setOpenAiBodyPreview(preview.requestBodyPreview);
      });
    }

    void refreshPreview();
  }, [deferredPullRequestBody, environment]);

  async function handleSummarize() {
    setIsPending(true);

    try {
      const result = await summarizePullRequestAction(environment, pullRequestBody);

      startTransition(() => {
        setSummary(result.summary);
        setModel(result.model);
        setOpenAiBodyPreview(result.requestBodyPreview);
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff4e2_0%,#fff9f1_42%,#f5efe5_100%)] text-slate-950">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-8 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <div className="space-y-5 lg:pr-6">
              <div className="inline-flex w-fit items-center rounded-full border border-amber-900/10 bg-amber-50 px-4 py-1.5 text-sm font-medium tracking-wide text-amber-900">
                Next.js server action demo
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[0.95] tracking-tight text-balance sm:text-5xl lg:text-[4.3rem]">
                Summarize a fake pull request with a Next.js server action.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
                This example calls a dedicated <code>use server</code> action. The action renders the prompt,
                calls OpenAI on the server, and returns the summary back to this client component.
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-black/10 bg-[#fffaf2] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="grid gap-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold">Fake pull request body</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Edit the seeded PR text, switch between dev and prod, then run the server action.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <button
                      type="button"
                      onClick={() => setEnvironment("dev")}
                      aria-pressed={environment === "dev"}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                        environment === "dev" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      Dev
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnvironment("prod")}
                      aria-pressed={environment === "prod"}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                        environment === "prod" ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      Prod
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="pullRequestBody" className="block text-sm font-medium text-slate-700">
                    pull_request_body
                  </label>
                  <textarea
                    id="pullRequestBody"
                    name="pullRequestBody"
                    value={pullRequestBody}
                    onChange={(event) => setPullRequestBody(event.target.value)}
                    className="mt-3 min-h-[20rem] w-full rounded-[1.4rem] border border-black/10 bg-white px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-black/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Environment</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Running with <span className="font-semibold text-slate-950">{environment}</span> prompt settings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSummarize}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? "Summarizing..." : "Run prompt"}
                  </button>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  Set <code>OPENAI_API_KEY</code> on the server, then run the same prompt with either dev or prod settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-[#0a1020] p-5 text-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Model output</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Server-rendered summary</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The result comes back from the server action after prompt rendering and the OpenAI request complete.
              </p>
            </div>
            {model ? (
              <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
                {model}
              </span>
            ) : null}
          </div>

          {summary ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-5 py-5 text-sm leading-7 whitespace-pre-wrap text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              {summary}
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-white/[0.03] px-5 py-10 text-sm leading-7 text-slate-300">
              The summary will appear here after the client calls the server function.
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-white/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Prompt pipeline</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">From markdown to response</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              This shows the same request moving left to right: prompt markdown, compiled ESM artifact, the OpenAI request body, and the returned result.
            </p>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-4">
            <article className="rounded-[1.5rem] border border-black/10 bg-[#fff8ef] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">1. Prompt markdown</p>
              <pre className="mt-4 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words rounded-[1.1rem] border border-black/8 bg-white px-4 py-4 font-mono text-xs leading-6 text-slate-800">{promptMarkdownSource}</pre>
            </article>

            <article className="rounded-[1.5rem] border border-black/10 bg-[#f8f6ff] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-800">2. Compiled ESM</p>
              <pre className="mt-4 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words rounded-[1.1rem] border border-black/8 bg-white px-4 py-4 font-mono text-xs leading-6 text-slate-800">{compiledPromptPreview}</pre>
            </article>

            <article className="rounded-[1.5rem] border border-black/10 bg-[#f4fbff] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">3. OpenAI body</p>
              <pre className="mt-4 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words rounded-[1.1rem] border border-black/8 bg-white px-4 py-4 font-mono text-xs leading-6 text-slate-800">{openAiBodyPreview}</pre>
            </article>

            <article className="rounded-[1.5rem] border border-black/10 bg-[#f5fbf5] p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">4. Result</p>
              <div className="mt-4 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words rounded-[1.1rem] border border-black/8 bg-white px-4 py-4 text-sm leading-7 text-slate-800">
                {resultPreview}
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}