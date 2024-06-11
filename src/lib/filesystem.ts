import { PathLike } from "fs";
import { access, mkdir } from "fs/promises";
import { DOCS_SEARCH_PATH } from "../constants";
import path from "path";
import os from "os";

export function expandDir(dir: string) {
  if (dir.startsWith("~")) {
    return path.join(os.homedir(), dir.slice(1));
  }

  return dir;
}

export async function createDirIfNotExists(dir: PathLike) {
  console.log(`---------------- createDirIfNotExists: ${dir}`);
  return await access(dir)
    .then(() => undefined)
    .catch(() => mkdir(dir));
}

export async function ensureDirsExist() {
  await createDirIfNotExists(expandDir(DOCS_SEARCH_PATH));
}
