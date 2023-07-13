"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandLineArgs = void 0;
const commandLineArgs = (cliArgs) => {
    const args = cliArgs.slice(2);
    const regex = /--[a-z]*/;
    let commands = {};
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
exports.commandLineArgs = commandLineArgs;
