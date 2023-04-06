"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var functions_1 = require("../util/functions");
module.exports = function (bot, reload) {
    fs.readdirSync("./slashcommands/").forEach(function (category) {
        var slashCommands = (0, functions_1.getFiles)("./slashcommands/".concat(category), ".js");
        slashCommands.forEach(function (f) {
            if (reload)
                delete require.cache[require.resolve("../slashcommands/".concat(category, "/").concat(f))];
            var slashCommand = require("./../slashcommands/".concat(category, "/").concat(f));
            bot.slashCommands.set(slashCommand.data.name, slashCommand);
            console.log("Slash Command: \u001B[35m ".concat(category, " \u001B[0m ~ \u001B[33m ").concat(slashCommand.data.name, " \u001B[0m ~ \u001B[32m Loaded \u001B[0m"));
        });
    });
};
