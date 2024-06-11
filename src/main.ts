import { Command } from "commander";
import "dotenv/config";
import { generate, generateStream, list } from "./commands";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found");
}

const program = new Command();

program
  .name("llm-codegen")
  .description("LLM-assisted code generation for your favorite libraries")
  .version("0.0.1");

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
    }
    // const output = await generate({
    //   componentName,
    //   prompt,
    // });

    // console.log(output);
  });

program.parse(process.argv);
