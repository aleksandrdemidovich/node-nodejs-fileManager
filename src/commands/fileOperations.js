import { promises as fs, createReadStream, createWriteStream } from "fs";
import { fileExists } from "../utils/fileUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";
import errors from "../utils/errors.js";

async function readFile(currentWorkingDirectory, args) {
  if (args.length < 1) {
    console.log(errors.invalidInput);
    return;
  }

  const filePath = args[0];
  const absolutePath = getAbsolutePath(currentWorkingDirectory, filePath);

  if (!(await fileExists(absolutePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  try {
    const data = await fs.readFile(absolutePath, { encoding: "utf-8" });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function createFile(currentWorkingDirectory, args) {
  if (args.length < 1) {
    console.log(errors.invalidInput);
    return;
  }

  const fileName = args[0];
  const absolutePath = getAbsolutePath(currentWorkingDirectory, fileName);

  if (await fileExists(absolutePath)) {
    console.log(errors.fileExists);
    return;
  } else {
    await fs.writeFile(absolutePath, "", "utf8");
    console.log("File created successfully.");
  }
}

async function renameFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const currentFilePath = args[0];
  const newFileName = args[1];
  const absoluteCurrentPath = getAbsolutePath(
    currentWorkingDirectory,
    currentFilePath
  );
  const absoluteNewPath = getAbsolutePath(currentWorkingDirectory, newFileName);

  if (!(await fileExists(absoluteCurrentPath))) {
    console.log(errors.fileNotFound);
    return;
  }

  if (await fileExists(absoluteNewPath)) {
    console.log(errors.fileExists);
    return;
  }

  try {
    await fs.rename(absoluteCurrentPath, absoluteNewPath);
    console.log("File renamed successfully.");
  } catch (err) {
    console.log(err);
  }
}

async function copyFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const sourceFilePath = args[0];
  const destinationFilePath = args[1];
  const absoluteSourcePath = getAbsolutePath(
    currentWorkingDirectory,
    sourceFilePath
  );
  const absoluteDestinationPath = getAbsolutePath(
    currentWorkingDirectory,
    destinationFilePath
  );

  if (!(await fileExists(absoluteSourcePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  if (await fileExists(absoluteDestinationPath)) {
    console.log(errors.fileExists);
    return;
  }

  const sourceStream = createReadStream(absoluteSourcePath);
  const destinationStream = createWriteStream(absoluteDestinationPath);

  destinationStream.on("error", (error) => {
    console.log("Error writing to destination file:", error);
  });

  destinationStream.on("close", () => {
    console.log("File copied successfully.");
  });

  sourceStream.pipe(destinationStream);
}

async function moveFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const sourceFilePath = args[0];
  const destinationFilePath = args[1];
  const absoluteSourcePath = getAbsolutePath(
    currentWorkingDirectory,
    sourceFilePath
  );
  const absoluteDestinationPath = getAbsolutePath(
    currentWorkingDirectory,
    destinationFilePath
  );

  if (!(await fileExists(absoluteSourcePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  if (await fileExists(absoluteDestinationPath)) {
    console.log(errors.fileExists);
    return;
  }

  const sourceStream = createReadStream(absoluteSourcePath);
  const destinationStream = createWriteStream(absoluteDestinationPath);

  destinationStream.on("error", (error) => {
    console.log("Error writing to destination file:", error);
  });

  destinationStream.on("close", async () => {
    await fs.unlink(absoluteSourcePath);
    console.log("File moved successfully.");
  });

  sourceStream.pipe(destinationStream);
}

async function deleteFile(currentWorkingDirectory, args) {
  if (args.length < 1) {
    console.log(errors.invalidInput);
    return;
  }

  const filePath = args[0];
  const absolutePath = getAbsolutePath(currentWorkingDirectory, filePath);

  if (!(await fileExists(absolutePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  await fs.unlink(absolutePath);
  console.log("File deleted successfully.");
}

export default {
  readFile,
  createFile,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};
