import { Bot } from "../types"

module.exports = {
    name: "ready",
    run: async (bot: Bot) => {
        const { client } = bot
        console.log(`Logged in as: \u001b[32m ${client.user.tag} \u001b[0m`)
    }
}
