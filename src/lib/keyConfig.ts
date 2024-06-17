import fs from "fs";
import { KEYS_FILE_PATH } from "../constants";
import { expandDir } from "./filesystem";
import { ensureSupportedModel } from "./models";

export function getKey(modelName: string) {
  ensureSupportedModel(modelName);

  const keyConfig = getConfig();
  const key = keyConfig[modelName];

  if (!key) {
    console.log(`No key found for model ${modelName}. Set one using 'lg keys set ${modelName}'.`);
    return;
  }

  return key;
}

export function getKeyFilePath() {
  return expandDir(KEYS_FILE_PATH);
}

export function getConfig() {
  const keyFilePath = getKeyFilePath();
  const keyConfig = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));
  return keyConfig;
}

export function saveConfigFile(keyConfig: Record<string, any>) {
  const keyFilePath = getKeyFilePath();

  fs.writeFileSync(keyFilePath, JSON.stringify(keyConfig));
}
