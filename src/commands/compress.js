import fs from "fs";
import { fileExists } from "../utils/fileUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";
import zlib from "zlib";

function compressFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log("Invalid input(wrong number of arguments).");
    return;
  }

  const srcFilePath = args[0];
  const destFilePath = args[1];
  const absSrcPath = getAbsolutePath(currentWorkingDirectory, srcFilePath);
  const absDestPath = getAbsolutePath(currentWorkingDirectory, destFilePath);

  if (!fileExists(absSrcPath)) {
    console.log("Source file not found.");
    return;
  }

  const readStream = fs.createReadStream(absSrcPath);
  const writeStream = fs.createWriteStream(absDestPath);
  const compressStream = zlib.createBrotliCompress();

  readStream.pipe(compressStream).pipe(writeStream);

  writeStream.on("finish", () => {
    console.log("File compressed successfully.");
  });
}

function decompressFile(currentWorkingDirectory, args) {
  if (args.length < 2) {
    console.log("Invalid input(wrong number of arguments).");
    return;
  }

  const srcFilePath = args[0];
  const destFilePath = args[1];
  const absSrcPath = getAbsolutePath(currentWorkingDirectory, srcFilePath);
  const absDestPath = getAbsolutePath(currentWorkingDirectory, destFilePath);

  if (!fileExists(absSrcPath)) {
    console.log("Source file not found.");
    return;
  }
  const readStream = fs.createReadStream(absSrcPath);
  const writeStream = fs.createWriteStream(absDestPath);
  const decompressStream = zlib.createBrotliDecompress();

  readStream.pipe(decompressStream).pipe(writeStream);

  writeStream.on("finish", () => {
    console.log("File decompressed successfully.");
  });
}

export default {
  compressFile,
  decompressFile,
};
