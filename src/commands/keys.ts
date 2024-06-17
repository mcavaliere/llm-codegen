import fs from "fs";
import { DOCS_SEARCH_PATH, KEYS_FILE_PATH, SUPPORTED_MODELS } from "../constants";
import { ensureDirExists, expandDir } from "../lib/filesystem";
import { input } from "@inquirer/prompts";
export function list() {
  if (!fs.existsSync(KEYS_FILE_PATH)) {
    console.log("No API keys found. Run 'lg keys set' to add one.");
    return;
  }
}

export async function set(modelName: string) {
  if (!SUPPORTED_MODELS.includes(modelName.toLowerCase())) {
    console.log(
      `Model ${modelName} is not supported. Supported models are: ${SUPPORTED_MODELS.join(", ")}`
    );
    return;
    2;
  }

  await ensureDirExists(DOCS_SEARCH_PATH);

  const keyFilePath = expandDir(KEYS_FILE_PATH);

  try {
    const contents = fs.readFileSync(keyFilePath, "utf8");
  } catch (e) {
    try {
      // Create the file if it doesn't exist
      fs.writeFileSync(keyFilePath, JSON.stringify({}), {
        flag: "w+",
      });
    } catch (e) {
      console.log(`Error creating file: `, e);
    }
  }

  // Read existing config into object
  const keyConfig = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

  const key = await input({ message: `Enter your ${modelName} API key:` });

  keyConfig[modelName] = key;

  // Write the new config back to the file
  fs.writeFileSync(keyFilePath, JSON.stringify(keyConfig, null, 2));

  console.log(`Configured ${modelName} API key and saved updated config to ${KEYS_FILE_PATH}`);
}
