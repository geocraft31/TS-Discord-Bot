import { Bot, Event } from "./../types"
import { getFiles, triggerEventHandler } from "../util/functions"
import Discord = require("discord.js")

module.exports = (bot: Bot, reload: boolean) => {
    
    let events = getFiles("./events/", ".js")

    if (events.length === 0 ){
        console.log("No events to load")
    }

    events.forEach((f, i) => {
        
        if (reload)
            delete require.cache[require.resolve(`../events/${f}`)]

        const event: Event = require(`../events/${f}`)
        bot.events.set(event.name, event)

        console.log(`Event: \u001B[33m ${event.name} \u001b[0m ~ \u001B[32m Loaded \u001b[0m`)
    })

    if (!reload)
        initEvents(bot)
}

function initEvents(bot: Bot) {
    
    const { client } = bot

    client.on("ready", () => {
        triggerEventHandler(bot, "ready")
    })

    client.on("messageCreate", (message: Discord.Message) => {
        triggerEventHandler(bot, "messageCreate", message)
    })

    client.on("guildCreate", (guild: Discord.Guild) => {
        triggerEventHandler(bot, "guildCreate", guild)
    })

    client.on(Discord.Events.InteractionCreate, (interaction: Discord.Interaction) => {
        if (!interaction.isChatInputCommand()) return
        triggerEventHandler(bot, "interactionCreate", interaction)
    })


}