import Discord = require("discord.js")
import { Bot } from "./types"

require("dotenv").config({path: "./../.env"})

const client = new Discord.Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "MessageContent",
        "GuildMembers",
        "GuildVoiceStates"
    ]
})

let bot = {
    client,
    audio: new Discord.Collection,
    prefix: "?",
    owners: ["581529736396931072"],
    events: new Discord.Collection,
    commands: new Discord.Collection,
    slashCommands: new Discord.Collection
}

const loadEvents = (bot, reload: boolean) => require("./handlers/events")(bot, reload)
loadEvents(bot, false)

const loadCommands = (bot, reload: boolean) => require("./handlers/commands")(bot, reload)
loadCommands(bot, false)

const loadSlashCommands = (bot, reload: boolean) => require("./handlers/slashcommands")(bot, reload)
loadSlashCommands(bot, false)


client.login(process.env.TOKEN)