import { Bot } from "../../types";
import Discord = require("discord.js")

module.exports = {
    name: "ping",
    category: "info",
    devOnly: true,
    run: async (bot: Bot, message: Discord.Message, ...args:Array<string> ) => {
        message.reply("pong")
    }
}