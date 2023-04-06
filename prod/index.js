"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
require("dotenv").config({ path: "./../.env" });
var client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        "GuildMembers",
        "GuildVoiceStates"
    ]
});
var bot = {
    client: client,
    audio: new Discord.Collection,
    prefix: "?",
    owners: ["581529736396931072"],
    events: new Discord.Collection,
    commands: new Discord.Collection,
    slashCommands: new Discord.Collection
};
var loadEvents = function (bot, reload) { return require("./handlers/events")(bot, reload); };
loadEvents(bot, false);
var loadCommands = function (bot, reload) { return require("./handlers/commands")(bot, reload); };
loadCommands(bot, false);
var loadSlashCommands = function (bot, reload) { return require("./handlers/slashcommands")(bot, reload); };
loadSlashCommands(bot, false);
client.login(process.env.TOKEN);
