const args = process.argv.slice(2);
const usernameArg = args.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'unknown user';

console.log(`Welcome to the File Manager, ${username}!\n`);

let currentWorkingDirectory = process.cwd();

console.log(`You are currently in ${currentWorkingDirectory}\n`);

process.stdin.on('data', userInput => {
  const command = userInput.toString().trim();
  executeCommand(command);
});

function executeCommand(command) {
  const [operation, ...args] = command.split(' ');

  switch (operation) {
    case '.exit':
      exitFileManager();
      break;
    default:
      console.log('Invalid input.\n');
  }
}

function exitFileManager() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
console.log('Enter commands:');
