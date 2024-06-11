import { PathLike } from "fs";
import { access, mkdir } from "fs/promises";
import { DOCS_SEARCH_PATH } from "../constants";
import path from "path";
import os from "os";
import fg from "fast-glob";

export function expandDir(dir: string) {
  if (dir.startsWith("~")) {
    return path.join(os.homedir(), dir.slice(1));
  }

  return dir;
}

export function contractDir(dir: string) {
  return dir.replace(os.homedir(), "~");
}

export async function createDirIfNotExists(dir: PathLike) {
  return await access(dir)
    .then(() => undefined)
    .catch(() => mkdir(dir));
}

export async function ensureDirsExist() {
  await createDirIfNotExists(expandDir(DOCS_SEARCH_PATH));
}

export async function loadDocs(): Promise<Record<string, string>> {
  const files = await fg.glob(`${expandDir(DOCS_SEARCH_PATH)}/**/*`);
  return files.reduce((acc, file) => {
    acc[docNameFromPath(file)] = file;
    return acc;
  }, {} as Record<string, string>);
}

export function docNameFromPath(filePath: string) {
  return (
    filePath
      // Chop off the full path to the docs directory
      .replace(path.join(expandDir(DOCS_SEARCH_PATH), path.sep), "")
      // Chop off the file extension
      .replace(/(.*)\.(.*?)$/, "$1")
  );
}
