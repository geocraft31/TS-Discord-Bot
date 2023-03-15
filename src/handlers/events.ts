import Path = require("path")
import fs = require("fs")
import { Bot, Event } from "../types"

const eventsPath = Path.resolve(__dirname, "./../events/")

module.exports = (bot:Bot) => {
    const events = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"))
    
    events.forEach(eventName => {
        const event: Event = require(eventsPath + `/${eventName}`)
        bot.events.set(event.name, event)

        console.log(`Event: \u001b[33m ${event.name} \u001b[0m ~ \u001b[32m Loaded \u001b[0m`)
    })
    
    initEvents(bot)
}

const initEvents = (bot: Bot) => {
    
    const { client } = bot

    client.on("ready", () => {
        triggerEventHandler(bot, "ready")
    })

    client.on("messageCreate", (message) => {
        triggerEventHandler(bot, "messageCreate", message)
    })

}

const triggerEventHandler = (bot: Bot, eventName: string, ...args) => {
    const { events } = bot
    try {
        if (events.has(eventName))
            events.get(eventName).run(bot, ...args)
        else
            throw new Error(`Event ${eventName} does not exist`)
    } catch (err) {
        console.error(err)
    }
}
