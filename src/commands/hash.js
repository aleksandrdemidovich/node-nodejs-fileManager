import fs from "fs/promises";
import crypto from "crypto";
import { fileExists } from "../utils/fileUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";

async function calculateFileHash(currentWorkingDirectory, args) {
  if (args.length < 1) {
    console.log("Invalid input. Please provide the path to the file.");
    return;
  }

  const filePath = args[0];
  const absolutePath = getAbsolutePath(currentWorkingDirectory, filePath);

  if (!fileExists(absolutePath)) {
    console.log("Invalid input (file not found).");
    return;
  }

  try {
    const data = await fs.readFile(absolutePath, { encoding: "utf8" });
    console.log(
      `File hash: ${crypto.createHash("sha256").update(data).digest("hex")}`
    );
  } catch (err) {
    console.log("An error occurred while calculating the file hash.");
    console.log(err);
  }
}

export default {
  calculateFileHash,
};
