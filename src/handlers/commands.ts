import { Bot, Command } from "../types";
import fs = require("fs")
import { getFiles } from "../util/functions";

module.exports = (bot: Bot, reload: boolean) => {

    fs.readdirSync("./commands/").forEach((category) => {

        let commands = getFiles(`./commands/${category}`, ".js")

        commands.forEach(f => {
            if (reload)
                delete require.cache[require.resolve(`../commands/${category}/${f}`)]
            
            const command: Command = require(`./../commands/${category}/${f}`)
            bot.commands.set(command.name, command)

            console.log(`Command: \u001B[34m ${command.category} \u001B[0m ~ \u001B[33m ${command.name} \u001b[0m ~ \u001B[32m Loaded \u001b[0m`)

            command["alias"].forEach(alias => {
                bot.commands.set(alias, command)
            })
        })
    })
}