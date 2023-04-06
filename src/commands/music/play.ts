import { Bot, SongData } from "../../types";
import Discord = require("discord.js")
import Builder = require("@discordjs/builders")
import Voice = require("@discordjs/voice")
import Play = require("play-dl")
import { triggerEventHandler, playSong, logger, disconectBot } from "../../util/functions";

module.exports = {
    name: "play",
    category: "music",
    permissions: [],
    alias: ["p"],
    description: "Plays the song given",
    example: "play <song>",
    devOnly: false,
    run: async (bot: Bot, message: Discord.Message, args: Array<string>) => {
        
        const { audio, client } = bot

        const userID = message.author.id
        const voiceChannel = message.member.voice
        const guildID = message.guildId

        if (!audio.has(guildID)) {
            const settings = {
                player: new Voice.AudioPlayer({
                    behaviors: {
                        noSubscriber: Voice.NoSubscriberBehavior.Pause
                    },
                    debug: true
                }),
                textChannelID: message.channelId,
                songs: new Discord.Collection,
                loopqueue: false,
                voiceChannel: voiceChannel,
                voiceChannelID: voiceChannel.channelId,
                disconectInterval: (stop?: boolean) => {
                    var timer = setTimeout(() => {
                            disconectBot(bot, guildID)
                        }, (5 * 1000))
                    if (stop) {
                        clearTimeout(timer)
                    }
                }
            }

            audio.set(guildID, settings)

            audio.get(guildID).player.on("stateChange", (oldState, newState) => {
                triggerEventHandler(bot, "stateChange", newState, guildID)
            })
        }

        const GuildAudio = audio.get(guildID)
        var audioPlayer = GuildAudio.player

        if (voiceChannel.channelId == null) {
            return message.reply("Enter on a voice channel PUSSY")
        }

        if (GuildAudio.voiceConnection == undefined) {
            const voiceConnection = Voice.joinVoiceChannel({
                channelId: voiceChannel.channelId,
                guildId: guildID,
                debug: true,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            })
            
            voiceConnection.on("stateChange", (oldState, newState) => {
                logger("Voice Connection change", newState.status)
            })
    
            GuildAudio.voiceConnection = voiceConnection
        }


        const subscription = GuildAudio.voiceConnection.subscribe(audioPlayer)
        GuildAudio.subscription = subscription

        let prompt = args.join(' ')

        if (prompt.includes("youtube.com")) {
            if (prompt.includes("playlist")) {
                // youtube playlist
                let playlist_raw = await Play.playlist_info(prompt)
                let playlist = await playlist_raw.all_videos()
                playlist.forEach(async (video) => {
                    let video_data = {
                        title: video.title,
                        url: video.url,
                        duration: video.durationRaw,
                        thumbnail: video.thumbnails[0].url,
                        channel: video.channel.name
                    }
                    let songs = GuildAudio.songs
                    songs.set(songs.size, video_data)
                });
                // message.channel.get(message.channelId).send("Playlist added successfuly")
            } else {
                // youtube video
                let raw_data = (await Play.video_info(prompt)).video_details

                let yt_info = raw_data
                let video_data = {
                    title: yt_info.title,
                    url: yt_info.url,
                    duration: yt_info.durationRaw,
                    thumbnail: yt_info.thumbnails[0].url,
                    channel: yt_info.channel.name
                }
                let songs = GuildAudio.songs
                songs.set(songs.size, video_data)

                message.reply("Song added successfuly")
            }
        } else if (prompt.includes("spotify"))
        {
            return message.reply("Spotify is not currently implemented")
        } else {
            let raw_data = await Play.search(prompt, { limit: 1 })
            let yt_info = raw_data[0]
            
            if (yt_info == undefined) {
                return message.reply("No se encontro ninguna canción")
            }

            let video_data = {
                title: yt_info.title,
                url: yt_info.url,
                duration: yt_info.durationRaw,
                thumbnail: yt_info.thumbnails[0].url,
                channel: yt_info.channel.name
            }
            let songs = GuildAudio.songs
            songs.set(songs.size, video_data)

        }

        if (audioPlayer.state.status == "idle") {
            let song: SongData = GuildAudio.songs.get(0)
            GuildAudio.textChannelID = message.channelId
            playSong(song, bot, guildID)
        } else {
            let song = GuildAudio.songs.last()
            const embed = new Builder.EmbedBuilder()
            embed.setTitle(song.title)
            embed.setDescription("`[ 00:00 | " + song.duration + " ]`")
            embed.setThumbnail(song.thumbnail)
            embed.setAuthor({name: "Added song"})
            embed.setURL(song.url)
            embed.setColor(5763719)
        
            bot.client.channels.fetch(GuildAudio.textChannelID).then((channel:Discord.TextChannel) => {
                channel.send({ embeds: [embed] })
            })
        }
    }
}