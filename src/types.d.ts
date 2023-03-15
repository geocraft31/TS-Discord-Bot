import Discord = require("discord.js")

type Bot = {
    client: Discord.Client,
    prefix: string,
    owners: Array<string>,
    events: Discord.Collection<string, Event>,
    commands: Discord.Collection<string, Command>
}

type Event = {
    name: string,
    run: CallableFunction
}

type Command = {
    name: string,
    category: string,
    permissions: Array<Discord.BitFieldResolvable<string, any>>
    devOnly: boolean,
    run: CallableFunction
}