import { promises as fs } from "fs";
import path from "path";
import { getFileType } from "../utils/fileUtils.js";
import { sortAlphabetically } from "../utils/sortUtils.js";
import { getAbsolutePath } from "../utils/pathUtils.js";
import { directoryExists } from "../utils/directoryUtils.js";

function goUp(currentWorkingDirectory) {
  const parentDirectory = path.dirname(currentWorkingDirectory);
  if (parentDirectory !== currentWorkingDirectory) {
    console.log(`You are now in ${parentDirectory}`);
    return parentDirectory;
  } else {
    console.log("You are already in the root directory.");
    return currentWorkingDirectory;
  }
}

async function goToDirectory(currentWorkingDirectory, directoryPath) {
  const absolutePath = getAbsolutePath(
    currentWorkingDirectory,
    directoryPath[0]
  );
  if (await directoryExists(absolutePath)) {
    console.log(`You are now in ${absolutePath}`);
    return absolutePath;
  } else {
    console.log("Directory not found.");
    return currentWorkingDirectory;
  }
}

async function listFilesAndFolders(currentWorkingDirectory) {
  const filesAndFolders = await fs.readdir(currentWorkingDirectory);
  const sortedfilesAndDirs = sortAlphabetically(filesAndFolders);
  const directories = [];
  const files = [];
  const tableData = [];

  for (let i = 0; i < sortedfilesAndDirs.length; i++) {
    const item = sortedfilesAndDirs[i];
    const itemPath = path.join(currentWorkingDirectory, item);
    const itemType = await getFileType(itemPath);

    if (itemType === "directory") {
      directories.push(item);
    } else {
      files.push(item);
    }
  }
  directories.sort((a, b) => a.localeCompare(b));
  files.sort((a, b) => a.localeCompare(b));

  const sortedFilesAndDirs = directories.concat(files);

  for (let i = 0; i < sortedFilesAndDirs.length; i++) {
    const item = sortedFilesAndDirs[i];
    const itemPath = path.join(currentWorkingDirectory, item);
    const itemType = await getFileType(itemPath);

    tableData.push({
      Name: item,
      Type: itemType,
    });
  }

  console.table(tableData);
}

export default {
  goUp,
  goToDirectory,
  listFilesAndFolders,
};
