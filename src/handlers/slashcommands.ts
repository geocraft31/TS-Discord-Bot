import { Bot } from "../types";
import fs = require("fs")
import { getFiles } from "../util/functions";

module.exports = (bot: Bot, reload: boolean) => {
    
    fs.readdirSync("./slashcommands/").forEach(category => {
        
        let slashCommands = getFiles(`./slashcommands/${category}`, ".js")

        slashCommands.forEach(f => {
            if (reload)
                delete require.cache[require.resolve(`../slashcommands/${category}/${f}`)]

            const slashCommand = require(`./../slashcommands/${category}/${f}`)
            bot.slashCommands.set(slashCommand.data.name, slashCommand)

            console.log(`Slash Command: \u001B[35m ${category} \u001B[0m ~ \u001B[33m ${slashCommand.data.name} \u001b[0m ~ \u001B[32m Loaded \u001b[0m`)

        })
    })
}