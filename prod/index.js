"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require("discord.js");
var initEvents = require("./handlers/events").initEvents;
require("dotenv").config({ path: "../.env" });
var client = new Discord.Client({
    intents: [
        "MessageContent",
        "GuildMessages",
        "Guilds"
    ]
});
var bot = {
    client: client,
    prefix: "?",
    owners: ["581529736396931072"],
    events: new Discord.Collection(),
    commands: new Discord.Collection()
};
var loadEvents = function (bot) { return require("./handlers/events")(bot); };
loadEvents(bot);
var loadCommands = function (bot) { return require("./handlers/commands")(bot); };
loadCommands(bot);
client.login(process.env.TOKEN);
