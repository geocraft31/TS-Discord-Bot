import fs = require("fs")
import Play = require("play-dl")
import { Bot, Event, SongData } from "../types"
import Builder = require("@discordjs/builders")
import Discord = require("discord.js")
import Voice = require("@discordjs/voice")

export const getFiles = (path: string, ending: string) => {
    return fs.readdirSync(path).filter(f => f.endsWith(ending))
}

export const triggerEventHandler = (bot: Bot, eventName:string, ...args) => {
    const { client } = bot

    try {
        if (bot.events.has(eventName))
            bot.events.get(eventName).run(bot, ...args)
        else 
            throw new Error(`Event ${eventName} does not exist`)
    } catch (err) {
        console.error(err)
    }
}

export const logger = (type: string, name: string, ...args: any) => {
    let date = new Date
    let hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds()
    
    var hourFormated:any = hour,
        minuteFormated:any = minute,
        secondFormated:any = second
    
        if (hour < 10) {
        hourFormated = '0' + hour
    }
    if (minute < 10) {
        minuteFormated = '0' + minute
    }
    if (second < 10) {
        secondFormated = '0' + second
    }

    const dateformat = '[ \x1b[32m' + [
        date.getDate(),
        date.getMonth() + 1,
        date.getFullYear()
    ].join('/') + ' - ' + [
        hourFormated,
        minuteFormated,
        secondFormated
    ].join(':') +' \x1b[0m]'

    if (args != "") {
        console.log(`${dateformat} ~ ${type}: \x1b[33m${name}\x1b[0m (\x1b[36m ${args.join(" ")} \x1b[0m)`)
    } else {
        console.log(`${dateformat} ~ ${type}: \x1b[33m${name}\x1b[0m`)
    }
}

export const playSong = async(song: SongData, bot: Bot, guildID: string) => {

    const channelID = bot.audio.get(guildID).textChannelID
    const audioPlayer = bot.audio.get(guildID).player

    let title = song.title,
        duration = song.duration,
        thumbnail = song.thumbnail,
        url = song.url
    
    const embed = new Builder.EmbedBuilder()
    embed.setTitle(title)
    embed.setDescription("`[ 00:00 | " + duration + " ]`")
    embed.setThumbnail(thumbnail)
    embed.setAuthor({name: "Now Playing"})
    embed.setURL(url)
    embed.setColor(1752220)

    const stream = await Play.stream(url)
    const songResource = Voice.createAudioResource(stream.stream, {
        inputType: stream.type
    })
    audioPlayer.play(songResource)

    bot.client.channels.fetch(channelID).then((channel:Discord.TextChannel) => {
        channel.send({ embeds: [embed] })
    })
}

export const disconectBot = (bot: Bot, guildID: string) => {
    const GuildAudio = bot.audio.get(guildID)

    GuildAudio.voiceConnection.disconnect()
    GuildAudio.subscription.unsubscribe()
    clearTimeout(GuildAudio.disconectInterval)
    GuildAudio.voiceConnection.removeAllListeners()
    GuildAudio.player.removeAllListeners()

    bot.audio.delete(guildID)
}

export const createTimeout = (bot: Bot, guildID: string) => {
    return setTimeout(() => {
        disconectBot(bot, guildID)
    }, 30 * 1000);
}

module.exports = {
    getFiles,
    playSong,
    triggerEventHandler,
    logger,
    disconectBot,
    createTimeout
}