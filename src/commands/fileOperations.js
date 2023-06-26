import { promises as fs, createReadStream, createWriteStream } from "fs";
import { fileExists } from "../utils/fileUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";
import { directoryExists } from "../utils/directoryUtils.js";
import errors from "../utils/errors.js";
import path from "path";

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
    const readableStream = createReadStream(absolutePath, {
      encoding: "utf-8",
    });

    readableStream.on("data", (chunk) => {
      console.log(chunk);
    });

    readableStream.on("error", (error) => {
      console.log(errors.operationFailed);
    });
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
    console.log(errors.executionError);
  }
}

async function copyFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const sourceFilePath = args[0];
  const destinationFolderName = args[1];
  const absoluteSourcePath = getAbsolutePath(
    currentWorkingDirectory,
    sourceFilePath
  );
  const absoluteDestinationPath = getAbsolutePath(
    currentWorkingDirectory,
    destinationFolderName
  );

  if (!(await fileExists(absoluteSourcePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  if (!(await directoryExists(absoluteDestinationPath))) {
    console.log(errors.directoryNotFound);
    return;
  }

  const sourceFileName = path.basename(absoluteSourcePath);
  const absoluteDestinationFilePath = path.join(
    absoluteDestinationPath,
    sourceFileName
  );

  if (await fileExists(absoluteDestinationFilePath)) {
    console.log(errors.fileExists);
    return;
  }

  const sourceStream = createReadStream(absoluteSourcePath);
  const destinationStream = createWriteStream(absoluteDestinationFilePath);

  destinationStream.on("error", (error) => {
    console.log(errors.executionError, error);
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
  const destinationFolderPath = args[1];
  const absoluteSourcePath = getAbsolutePath(
    currentWorkingDirectory,
    sourceFilePath
  );
  const absoluteDestinationFolderPath = getAbsolutePath(
    currentWorkingDirectory,
    destinationFolderPath
  );

  if (!(await fileExists(absoluteSourcePath))) {
    console.log(errors.fileNotFound);
    return;
  }

  if (!(await directoryExists(absoluteDestinationFolderPath))) {
    console.log(errors.directoryNotFound);
    return;
  }

  const destinationFileName = path.basename(absoluteSourcePath);
  const absoluteDestinationPath = path.join(
    absoluteDestinationFolderPath,
    destinationFileName
  );

  try {
    await fs.rename(absoluteSourcePath, absoluteDestinationPath);
    console.log('File moved successfully.');
  } catch (err) {
    console.log(errors.executionError, err);
  }
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

  try {
    await fs.unlink(absolutePath);
    console.log("File deleted successfully.");
  } catch (err) {
    console.log(errors.executionError, err);
  }
  
}

export default {
  readFile,
  createFile,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};
