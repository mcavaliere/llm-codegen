import OpenAI from "openai";
import 'dotenv/config'

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

const openai = new OpenAI();

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });

  console.log(`---------------- chatCompletion: `, chatCompletion);
}

main();