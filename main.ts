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
  .argument("[prompt]", "Optional prompt to customize the generated code.")
  .action(async (componentName, prompt) => {
    const output = await generate({
      componentName,
      prompt,
    });

    console.log(output);
  });

program.parse(process.argv);
