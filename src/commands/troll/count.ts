import { Bot } from "../../types"
import Discord = require("discord.js")

module.exports = {
    name: "count",
    category: "troll",
    permissions: [],
    alias: [],
    description: "Counts to 1 million",
    example: "count",
    devOnly: true,
    run: async (bot: Bot, message: Discord.Message, args: Array<string>) => {
        message.delete()
        try{
            for (let i = 1; i <= Number(args[0]); i++) {
                await message.channel.send(`${i}`)
            }
        } catch {
            message.channel.send("You didn't type a number")
        }

    }
}
