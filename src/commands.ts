import fs from "fs";
import OpenAI from "openai";
import { ensureDirsExist, getDocContents, loadDocs } from "./lib/filesystem";
import { stripMarkdown } from "./lib/stripMarkdown";

export const systemPrompt = `
You're an expert full-stack software engineer with vast knowledge of TypeScript, JavaScript and React.
Your responses should only be code, without explanation or formatting. This is very important. If you include formatting or explanations, I will be fired.
I'm going to provide the documentation for a single component or function in a specific library and then ask you to do something with it.
Don't do anything with it yet, and don't respond to this prompt.`;
export function docPrompt(componentName: string, fileContent: string) {
  return `This is the documentation for ${componentName}. It contains a code example for ${componentName}. Return the relevant portions if I ask you to generate a ${componentName}.

  <DOC>
    ${fileContent}
  </DOC>
`;
}

export function generationPrompt(componentName: string, prompt: string = "") {
  return `Generate the code for a ${componentName}. ${prompt} Output only the code and no other characters. `;
}

export async function generate({
  componentName,
  prompt = "",
}: {
  componentName: string;
  prompt: string;
}) {
  await ensureDirsExist();
  const fileContent = await getDocContents(componentName);

  const openai = new OpenAI();
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: docPrompt(componentName, fileContent),
      },
      {
        role: "user",
        content: generationPrompt(componentName, prompt),
      },
    ],
    model: "gpt-4o",
  });

  return chatCompletion.choices[0].message.content;
}

export async function generateStream({
  componentName,
  prompt = "",
}: {
  componentName: string;
  prompt: string;
}) {
  await ensureDirsExist();
  const fileContent = await getDocContents(componentName);

  const openai = new OpenAI();
  const chatCompletion = await openai.chat.completions.create({
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: docPrompt(componentName, fileContent),
      },
      {
        role: "user",
        content: generationPrompt(componentName, prompt),
      },
    ],
    model: "gpt-4o",
  });

  for await (const message of chatCompletion) {
    if (message.choices[0].delta.content) {
      process.stdout.write(stripMarkdown(message.choices[0].delta.content));
    }
  }
}

export async function list() {
  const dirs = await loadDocs();
  console.log(Object.keys(dirs).join("\n"));
}
