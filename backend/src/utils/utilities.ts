type cliArgs = { [flag: string]: string }

const commandLineArgs = (cliArgs: string[]): cliArgs => {
  const args = cliArgs.slice(2);
  const regex = /--[a-z]*/;
  let commands: { [flag: string]: string } = {};
  args.forEach((arg, index) => {
    let flagarray = arg.match(regex);
    if (!flagarray) {
      return;
    }
    let flag = flagarray[0].slice(2);
    commands[flag] = args[index + 1];
  });
  return commands;
};

export {commandLineArgs}
