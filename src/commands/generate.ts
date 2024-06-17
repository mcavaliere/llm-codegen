import OpenAI from "openai";
import { ensureDirsExist, getDocContents, loadDocs } from "../lib/filesystem";
import { stripMarkdown } from "../lib/stripMarkdown";
import { RequestOptions } from "openai/core";
import { ChatCompletion, ChatCompletionChunk } from "openai/resources/chat/completions";
import { Stream } from "openai/streaming";
import ora from "ora";
import { getKey } from "../lib/keyConfig";

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

export async function generateBase({
  componentName,
  prompt,
  options = {
    stream: false,
  },
}: {
  componentName: string;
  prompt: string;
  options: RequestOptions;
}) {
  const fileContent = await getDocContents(componentName);

  const openai = new OpenAI({
    apiKey: getKey("openai"),
  });

  return openai.chat.completions.create({
    ...options,
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
}

export async function generateSync({
  componentName,
  prompt = "",
}: {
  componentName: string;
  prompt: string;
}) {
  await ensureDirsExist();

  const spinner = ora(`Generating a ${componentName}`).start();
  const chatCompletion = (await generateBase({
    componentName,
    prompt,
    options: { stream: false },
  })) as ChatCompletion;
  spinner.stop();

  const output = chatCompletion.choices[0].message.content;

  if (output) {
    console.log(stripMarkdown(output));
  }
}

export async function generateStream({
  componentName,
  prompt = "",
}: {
  componentName: string;
  prompt: string;
}) {
  await ensureDirsExist();

  const chatCompletion = (await generateBase({
    componentName,
    prompt,
    options: { stream: true },
  })) as Stream<ChatCompletionChunk>;

  for await (const message of chatCompletion) {
    if (message.choices[0].delta.content) {
      process.stdout.write(stripMarkdown(message.choices[0].delta.content));
    }
  }
}

export async function generate({
  componentName,
  prompt = "",
  options: { stream = false } = { stream: false },
}: {
  componentName: string;
  prompt: string;
  options: { stream: boolean };
}) {
  if (stream) {
    await generateStream({ componentName, prompt });
  } else {
    await generateSync({ componentName, prompt });
  }
}

export async function list() {
  const dirs = await loadDocs();
  console.log(Object.keys(dirs).join("\n"));
}
