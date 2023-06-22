import { promises as fs } from "fs";

export async function fileExists(filePath) {
  return !!(await fs.stat(filePath).catch((e) => false));
}
