import "dotenv/config";
import { Command } from "commander";
import { generate, generateStream, list } from "./commands/generate";
import { stripMarkdown } from "./lib/stripMarkdown";
import config from "../package.json";
import ora from "ora";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

const program = new Command();

program
  .name("llm-codegen")
  .description("LLM-assisted code generation for your favorite libraries")
  .version(config.version);

program
  .command("list")
  .description("List all the documents available for code generation.")
  .action(async () => {
    await list();
  });

program
  .command("gen")
  .description("Generate the code for a component")
  .option("-s, --stream", "Stream the output as it generates", false)
  .argument("<component>", "The name of the component")
  .argument("[prompt]", "Optional prompt to customize the generated code")
  .action(async (componentName, prompt, options) => {
    if (options.stream === true) {
      await generateStream({
        componentName,
        prompt,
      });
    } else {
      const spinner = ora(`Generating a ${componentName}`).start();
      const output = await generate({
        componentName,
        prompt,
      });

      spinner.stop();
      if (output) console.log(stripMarkdown(output));
    }
  });

program.parse(process.argv);
