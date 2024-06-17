import "dotenv/config";
import { Command } from "commander";
import * as generateCommands from "./commands/generate";
import * as keyCommands from "./commands/keys";
import config from "../package.json";

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

keys
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
    await generateCommands.generate({
      componentName,
      prompt,
      options,
    });
  });

generate
  .command("list")
  .description("List all generators currently available.")
  .action(() => {
    generateCommands.list();
  });

program.parse(process.argv);
