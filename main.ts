import OpenAI from "openai";
import { Command } from "commander";
import "dotenv/config";
import { generate } from "./commands";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

const program = new Command();

program.name("shadgen").description("LLM component generation for Shadcn-UI").version("0.0.1");

program
  .command("gen")
  .description("Generate the code for a component")
  .argument("<component>", "The name of the component")
  .action(async (componentName) => {
    console.log(`componentName: `, componentName);
    const result = await generate(componentName);
  });

program.parse(process.argv);
