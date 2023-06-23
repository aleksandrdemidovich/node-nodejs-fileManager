import osInfoCommands from "./commands/osInfo.js";
import hashCommands from "./commands/hash.js";
import compressCommands from "./commands/compress.js";
import fileOperationCommands from "./commands/fileOperations.js";

const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));
const username = usernameArg ? usernameArg.split("=")[1] : "unknown user";

console.log(`Welcome to the File Manager, ${username}!\n`);

let currentWorkingDirectory = osInfoCommands.getHomeDirectory();

console.log(`You are currently in ${currentWorkingDirectory}\n`);

process.stdin.on("data", (userInput) => {
  const command = userInput.toString().trim();
  executeCommand(command);
});

function executeCommand(command) {
  const [operation, ...args] = command.split(" ");

  switch (operation) {
    case "cat":
      fileOperationCommands.readFile(currentWorkingDirectory, args);
      break;
    case "add":
      fileOperationCommands.createFile(currentWorkingDirectory, args);
      break;
    case "rn":
      fileOperationCommands.renameFile(currentWorkingDirectory, args);
      break;
    case "cp":
      fileOperationCommands.copyFile(currentWorkingDirectory, args);
      break;
    case "mv":
      fileOperationCommands.moveFile(currentWorkingDirectory, args);
      break;
    case "rm":
      fileOperationCommands.deleteFile(currentWorkingDirectory, args);
      break;
    case "os":
      osInfoCommands.handleOSCommand(args);
      break;
    case "hash":
      hashCommands.calculateFileHash(currentWorkingDirectory, args);
      break;
    case "compress":
      compressCommands.compressFile(currentWorkingDirectory, args);
      break;
    case "decompress":
      compressCommands.decompressFile(currentWorkingDirectory, args);
      break;
    case ".exit":
      exitFileManager();
      break;
    default:
      console.log("Invalid input.\n");
  }
}

function exitFileManager() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}
process.on("SIGINT", () => {
  exitFileManager();
});

process.stdin.resume();
process.stdin.setEncoding("utf8");
console.log("Enter commands:");
