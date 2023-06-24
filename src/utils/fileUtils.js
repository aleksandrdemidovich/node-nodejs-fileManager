import { promises as fs } from "fs";

async function fileExists(filePath) {
  return !!(await fs.stat(filePath).catch((e) => false));
}

async function getFileType(filePath) {
  const stats = await fs.stat(filePath);
  return stats.isDirectory() ? "directory" : "file";
}

export { fileExists, getFileType };
