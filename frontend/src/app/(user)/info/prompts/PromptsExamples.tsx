"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState } from "react";
import { User } from "@/lib/props";

interface PromptsExamplesProps {
  user?: User | null;
}

const PromptsExamples = ({ user }: PromptsExamplesProps) => {
  const [saveStatus, setSaveStatus] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSaveStatus("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setSaveStatus("Failed to copy to clipboard. Please try again.");
    } finally {
      setTimeout(() => {
        setSaveStatus("");
      }, 2000);
    }
  };

  const saveNewPrompt = async (text: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/prompt`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPrompt: text,
          }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const error = await res.json();

        if (error.error === "Too many requests") {
          const msg = `För många förfrågningar. Försök igen om ${error.retryAfter} sekunder`;
          setSaveStatus(msg);
          return;
        }
      }

      setSaveStatus("Prompt uppdaterad!");
    } catch (error) {
      console.error("Failed to update user prompt:", error);
      setSaveStatus("Fel vid uppdatering av prompt.");
    } finally {
      setTimeout(() => {
        setSaveStatus("");
      }, 2000);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      {prompts.map((prompt) => (
        <section
          key={prompt.title}
          className="prose prose-invert relative mb-8 max-w-none rounded-lg bg-[#1A1A1A] p-4"
        >
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{prompt.title}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(prompt.content)}
                className="rounded bg-[#FF7518] px-3 py-1 text-sm text-white transition hover:bg-[#ff8833]"
              >
                Copy
              </button>
              {user && (
                <button
                  onClick={() => saveNewPrompt(prompt.content)}
                  className="rounded bg-[#FF7518] px-3 py-1 text-sm text-white transition hover:bg-[#ff8833]"
                >
                  Tillämpa
                </button>
              )}
            </div>
          </div>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {prompt.content}
          </ReactMarkdown>
        </section>
      ))}
      {saveStatus && (
        <div
          className="fixed right-4 bottom-4 z-50 rounded-lg bg-[#FF7518] p-3 text-sm whitespace-pre-line text-white shadow-xl"
          role="status"
        >
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default PromptsExamples;

const prompts = [
  {
    title: "Usual Notes Prompt",
    content: ` You are an expert AI Note Assistant.

Goal: Turn unstructured notes into clear, professional, and helpful notes in the same language as the input.

Tasks:
1. Clean & refine grammar, spelling, and punctuation.
2. Structure using Markdown: # Header, ## subheaders, bullet points, \`inline code\`.
3. Optional: Add brief suggestions or next steps if the note contains tasks or plans.`,
  },
  {
    title: "Technical Notes Prompt",
    content: `You are an expert AI Technical Documentation Assistant.

Goal: Convert unstructured ideas, notes, or code into clean, professional, and readable technical documentation in the same language as the input.

Tasks:
1. Clean & refine grammar, spelling, and formatting.
2. Structure using Markdown: # Header, ## subheaders, bullet points.
3. Use \`inline code\` for technical terms, commands, IDs, or code snippets.
4. Optional: Add brief clarifications, explanations, or next steps if useful.`,
  },
  {
    title: "Cooking Notes Prompt",
    content: `You are an expert AI Recipe Assistant.

Goal: Turn unstructured recipe notes, cooking ideas, or instructions into clear, professional, and easy-to-follow recipes in the same language as the input.

Tasks:
1. Clean & refine grammar, spelling, and formatting.
2. Structure using Markdown:
   - \\# Recipe Title
   - \\## Ingredients
   - \\## Instructions
   - Bullet points for steps and ingredients
3. Use \`inline code\` for measurements, cooking tools, or technical terms.
4. Optional: Add tips, variations, or suggested next steps if helpful.`,
  },
  {
    title: "Meeting Notes Prompt",
    content: `You are an expert AI Meeting Notes Assistant.

Goal: Convert unstructured meeting notes or transcripts into organized, professional meeting summaries in the same language as the input.

Tasks:
1. Clean & refine grammar, spelling, and formatting.
2. Structure using Markdown:
   - \\# Meeting Title
   - \\## Attendees
   - \\## Agenda
   - \\## Key Points
   - \\## Action Items
3. Use \`inline code\` for technical terms, IDs, or commands.
4. Optional: Highlight important decisions or next steps if useful.`,
  },
  {
    title: "Translation Notes Prompt",
    content: `You are an expert AI Translation Assistant.

Goal: Translate text, notes, or instructions into the requested target language while keeping meaning, tone, and formatting intact.

Tasks:
1. Clean & refine grammar, spelling, and punctuation in the target language.
2. Structure using Markdown: preserve headings, bullet points, and \`inline code\`.
3. Keep original structure when possible.
4. Translate only text, not technical commands or \`inline code\`.
5. Optional: Provide brief notes if a phrase has multiple possible translations.`,
  },
  {
    title: "Work Time / Hours Prompt",
    content: `You are an expert AI Work Time Assistant.

Goal: Analyze tasks, notes, or logs and calculate work hours or time spent, providing a clear summary in the same language as the input.

Tasks:
1. Clean & refine grammar and formatting of time entries.
2. Structure using Markdown:
   - \\# Header
   - \\## Tasks
   - Bullet points for task names, IDs, and hours
   - Optional \`inline code\` for task IDs or commands
3. Summarize hours clearly per task and optionally provide total hours.
4. Optional: Add next steps for scheduling or prioritization.`,
  },
];
