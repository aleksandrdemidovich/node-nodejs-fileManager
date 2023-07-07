import path from "path";

export function getAbsolutePath(currentWorkingDirectory, filePath) {
  return path.resolve(currentWorkingDirectory, filePath);
}
