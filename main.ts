import OpenAI from "openai";
import { Command } from 'commander'
import 'dotenv/config'

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

const program = new Command();

program
  .name('shadgen')
  .description('LLM component generation for Shadcn-UI')
  .version('0.0.1')

program
  .command('gen')
  .description('Generate the code for a component')
  .argument('<component>', 'The name of the component')

  program.parse(process.argv);

const openai = new OpenAI();

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });

  console.log(`---------------- chatCompletion: `, chatCompletion.choices[0].message.content);
}

main();