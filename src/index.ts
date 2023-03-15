import Discord = require("discord.js")
import { Bot } from "./types"
const { initEvents } = require("./handlers/events")
require("dotenv").config({path: "../.env"})


const client = new Discord.Client({
    intents: [
        "MessageContent",
        "GuildMessages",
        "Guilds"
    ]
})

let bot: Bot = {
    client,
    prefix: "?",
    owners: ["581529736396931072"],
    events: new Discord.Collection(),
    commands: new Discord.Collection()
}

const loadEvents = (bot: Bot) => require("./handlers/events")(bot)
loadEvents(bot)

const loadCommands = (bot: Bot) => require("./handlers/commands")(bot)
loadCommands(bot)

client.login(process.env.TOKEN)