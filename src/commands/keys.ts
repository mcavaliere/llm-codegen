import fs from "fs";
import { DOCS_SEARCH_PATH, KEYS_FILE_PATH, SUPPORTED_MODELS } from "../constants";
import { ensureDirExists, expandDir } from "../lib/filesystem";
import { input } from "@inquirer/prompts";
import { ensureSupportedModel } from "../lib/models";
import { getConfig, saveConfigFile } from "../lib/keyConfig";
export function list() {
  if (!fs.existsSync(KEYS_FILE_PATH)) {
    console.log("No API keys found. Run 'lg keys set' to add one.");
    return;
  }

  const keyFilePath = expandDir(KEYS_FILE_PATH);

  const keyConfig = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

  console.log(keyConfig);
}

export async function set(modelName: string) {
  ensureSupportedModel(modelName);

  await ensureDirExists(DOCS_SEARCH_PATH);

  const keyFilePath = expandDir(KEYS_FILE_PATH);

  try {
    fs.readFileSync(keyFilePath, "utf8");
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
  const keyConfig = getConfig();

  const key = await input({ message: `Enter your ${modelName} API key:` });

  keyConfig[modelName] = key;

  // Write the new config back to the file
  saveConfigFile(keyConfig);

  console.log(`Configured ${modelName} API key and saved updated config to ${KEYS_FILE_PATH}`);
}
