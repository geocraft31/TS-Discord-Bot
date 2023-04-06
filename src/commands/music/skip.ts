// TODO embed
import Discord = require("discord.js")
import { Bot } from "../../types"

module.exports = {
    name: "skip",
    category: "music",
    permissions: [],
    alias: ["s"],
    description: "Skips the currently playing song",
    example: "skip",
    devOnly: false,
    run: async ( bot: Bot, message: Discord.Message, args ) => {

        const { audio } = bot
        try {
            const guildID = message.guildId
            const audioPlayer = audio.get(guildID).player
            try {
                audioPlayer.stop()
                message.reply("Song skiped")
            } catch {
                message.reply("error")
            }
        } catch {
            message.reply("No song to skip")
        }
    }
}
