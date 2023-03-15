import { Bot } from "../types"
import Discord = require("discord.js")

module.exports = {
    name: "messageCreate",
    run: async (bot: Bot, message: Discord.Message,) => {
        
        const { prefix, owners } = bot

        if (!message.guild)
            return
        
        if (message.author.bot)
            return

        if (!message.content.startsWith(prefix))
            return

        const args = message.content.slice(prefix.length).trim().split(" ") // All the 'command' with arguments
        const cmdstr = args.shift().toLowerCase() // Just the 'command' name

        let command = bot.commands.get(cmdstr)
        if (!command) return

        let member = message.member

        if (command.devOnly && !owners.includes(member.id)) {
            return message.reply("This command is only available to the bot owners")
        }

        if (command.permissions && member.permissions.missing(command.permissions).length !== 0) {
            return message.reply("You do not have permissions to use this command")
        }
        
        try {
            const command = bot.commands.get(cmdstr)
            await command.run(bot, message,  args)
        } catch (err) {
            console.error(err)
        }
    }
}
