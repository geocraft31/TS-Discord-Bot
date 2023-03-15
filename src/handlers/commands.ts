import path = require("path")
import fs = require("fs")
import { Bot, Command } from "../types"

const commandsPath = path.resolve(__dirname, "./../commands/")

module.exports = (bot: Bot) => {
    
    const categories = fs.readdirSync(commandsPath)
    
    categories.forEach(category => {
        const commands = fs.readdirSync(`${commandsPath}/${category}`).filter(f => f.endsWith(".js"))

        commands.forEach(file => {
            const command: Command = require(`${commandsPath}/${category}/${file}`)
            bot.commands.set(command.name, command)

            console.log(`Command: \u001b[34m ${category} \u001b[0m ~ \u001b[33m ${command.name} \u001b[0m ~ \u001b[32m Loaded \u001b[0m`)
        })
    })
}