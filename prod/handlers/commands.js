"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var commandsPath = path.resolve(__dirname, "./../commands/");
module.exports = function (bot) {
    var categories = fs.readdirSync(commandsPath);
    categories.forEach(function (category) {
        var commands = fs.readdirSync("".concat(commandsPath, "/").concat(category)).filter(function (f) { return f.endsWith(".js"); });
        commands.forEach(function (file) {
            var command = require("".concat(commandsPath, "/").concat(category, "/").concat(file));
            bot.commands.set(command.name, command);
            console.log("Command: \u001B[34m ".concat(category, " \u001B[0m ~ \u001B[33m ").concat(command.name, " \u001B[0m ~ \u001B[32m Loaded \u001B[0m"));
        });
    });
};
