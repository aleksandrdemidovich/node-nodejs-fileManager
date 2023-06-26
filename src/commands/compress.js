import fs from "fs";
import { fileExists } from "../utils/fileUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";
import zlib from "zlib";
import errors from "../utils/errors.js";
import { directoryExists } from "../utils/directoryUtils.js";
import path from "path";

function compressFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const srcFilePath = args[0];
  const destFolderPath = args[1];
  const absSrcPath = getAbsolutePath(currentWorkingDirectory, srcFilePath);
  const absDestFolderPath = getAbsolutePath(
    currentWorkingDirectory,
    destFolderPath
  );

  if (!fileExists(absSrcPath)) {
    console.log(errors.fileNotFound);
    return;
  }

  if (!directoryExists(absDestFolderPath)) {
    console.log(errors.directoryNotFound);
    return;
  }

  const srcFileName = path.basename(absSrcPath);
  const archiveName = `${srcFileName}.br`;
  const absDestPath = path.join(absDestFolderPath, archiveName);

  const readStream = fs.createReadStream(absSrcPath);
  const writeStream = fs.createWriteStream(absDestPath);
  const compressStream = zlib.createBrotliCompress();

  readStream.pipe(compressStream).pipe(writeStream);

  writeStream.on("error", () => {
    console.log(errors.executionError);
  });

  writeStream.on("finish", () => {
    console.log("File compressed successfully.");
  });
}

function decompressFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log(errors.invalidInput);
    return;
  }

  const srcFilePath = args[0];
  const destFolderPath = args[1];
  const absSrcPath = getAbsolutePath(currentWorkingDirectory, srcFilePath);
  const absDestFolderPath = getAbsolutePath(
    currentWorkingDirectory,
    destFolderPath
  );

  if (!fileExists(absSrcPath)) {
    console.log(errors.fileNotFound);
    return;
  }

  if (!directoryExists(absDestFolderPath)) {
    console.log(errors.directoryNotFound);
    return;
  }

  const srcFileName = path.basename(absSrcPath);
  const destFileName = path.parse(srcFileName).name;
  const absDestPath = path.join(absDestFolderPath, destFileName);

  const readStream = fs.createReadStream(absSrcPath);
  const writeStream = fs.createWriteStream(absDestPath);
  const decompressStream = zlib.createBrotliDecompress();

  readStream.pipe(decompressStream).pipe(writeStream);

  writeStream.on("error", () => {
    console.log(errors.executionError);
  });

  writeStream.on("finish", () => {
    console.log("File decompressed successfully.");
  });
}

export default {
  compressFile,
  decompressFile,
};
