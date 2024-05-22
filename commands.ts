import fs from "fs";
import OpenAI from "openai";
import { inspect } from "util";

export const systemPrompt = `You're an expert full-stack software engineer with vast knowledge of TypeScript, JavaScript and React. You're an expert with the Shadcn-ui library. I'm going to provide the documentation for a single component in the shadcn-ui library and then ask you to do something with it. Don't do anything with it and don't respond to this prompt.`;
export function docPrompt(componentName: string, fileContent: string) {
  return `This is the documentation for the ${componentName} component in the shadcn-ui library:
  <DOC>
    ${fileContent}
  </DOC>
`;
}

export function generationPrompt(componentName: string, prompt: string = "") {
  return `Generate the code for an ${componentName} component with the shadcn-ui library. ${prompt} Output only the code and no other characters. `;
}

export async function generate({
  componentName,
  prompt = "",
}: {
  componentName: string;
  prompt: string;
}) {
  const filePath = `${process.cwd()}/shadcn-ui-components/${componentName}.mdx`;
  const fileContent = fs.readFileSync(filePath, "utf8");

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
