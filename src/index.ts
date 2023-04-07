import Discord = require("discord.js")
import Play = require("play-dl")

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

Play.setToken({
    spotify: {
        client_id: "766bd4e8c3be436cb757e6f1072e99e1",
        client_secret: process.env.CLIENT_SECRET,
        market: 'es',
        refresh_token: "AQATi9C1MoGKQZ0a5Z2gPI7Q54hfSz7Es_xUnCWiQ0OdHSY4avzah3NRcHQExyhR0yNWeIi4WXz9QeHLzbEhlktDOvd6g5wu5rwNlbHsTOmrpI10x5V_HmzlJJnw9MbQFEo"
    }
})

client.login(process.env.TOKEN)