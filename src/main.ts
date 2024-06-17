import "dotenv/config";
import { Command } from "commander";
import * as generateCommands from "./commands/generate";
import * as keyCommands from "./commands/keys";
import { stripMarkdown } from "./lib/stripMarkdown";
import config from "../package.json";
import ora from "ora";

const program = new Command();

program
  .name("lg")
  .description("LLM-assisted code generation for your favorite libraries")
  .version(config.version);

const keys = program.command("keys");

keys
  .command("list")
  .description("List all LLM API keys you've configured.")
  .action(() => {
    keyCommands.list();
  });

const keysSet = keys
  .command("set")
  .description("Save an API key for a langage model.")
  .argument("<model>", "The model to save an API key for.")
  .action(async (model) => {
    keyCommands.set(model);
  });

const generate = program.command("gen");

generate
  .command("list")
  .description("List all the documents available for code generation.")
  .action(async () => {
    await generateCommands.list();
  });

generate
  .description("Generate the code for a component")
  .option("-s, --stream", "Stream the output as it generates", false)
  .argument("<component>", "The name of the component")
  .argument("[prompt]", "Optional prompt to customize the generated code")
  .action(async (componentName, prompt, options) => {
    if (options.stream === true) {
      await generateCommands.generateStream({
        componentName,
        prompt,
      });
    } else {
      const spinner = ora(`Generating a ${componentName}`).start();
      const output = await generateCommands.generate({
        componentName,
        prompt,
      });

      spinner.stop();
      if (output) console.log(stripMarkdown(output));
    }
  });

generate
  .command("list")
  .description("List all generators currently available.")
  .action(() => {
    generateCommands.list();
  });

program.parse(process.argv);
