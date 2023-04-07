import { Bot, SongData } from "../../types";
import Discord = require("discord.js")
import Builder = require("@discordjs/builders")
import Voice = require("@discordjs/voice")
import Play = require("play-dl")
import { triggerEventHandler, playSong, logger, createTimeout } from "../../util/functions";

module.exports = {
    name: "play",
    category: "music",
    permissions: [],
    alias: ["p"],
    description: "Plays the song given",
    example: "play <song>",
    devOnly: false,
    run: async (bot: Bot, message: Discord.Message, args: Array<string>) => {
        
        const { audio } = bot

        const voiceChannel = message.member.voice
        const guildID = message.guildId

        if (!audio.has(guildID)) {

            let timer = createTimeout(bot, guildID)

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
                disconectInterval: timer
            }

            audio.set(guildID, settings)

            audio.get(guildID).player.on("stateChange", (oldState, newState) => {
                triggerEventHandler(bot, "stateChange", newState, guildID)
            })
        }
        
        clearInterval(audio.get(guildID).disconectInterval)
        
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
                const embed = new Builder.EmbedBuilder()
                embed.setTitle(playlist_raw.title)
                embed.setDescription("`[ Videos: " + playlist_raw.total_videos + " ]`")
                embed.setThumbnail(playlist_raw.thumbnail.url)
                embed.setAuthor({name: "Added playlist"})
                embed.setURL(playlist_raw.url)
                embed.setColor(5763719)
            
                bot.client.channels.fetch(GuildAudio.textChannelID).then((channel:Discord.TextChannel) => {
                    channel.send({ embeds: [embed] })
                })
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

                const embed = new Builder.EmbedBuilder()
                embed.setTitle(yt_info.title)
                embed.setDescription("`[ 00:00 | " + yt_info.durationRaw + " ]`")
                embed.setThumbnail(yt_info.thumbnails[0].url)
                embed.setAuthor({name: "Added video"})
                embed.setURL(yt_info.url)
                embed.setColor(5763719)
            
                bot.client.channels.fetch(GuildAudio.textChannelID).then((channel:Discord.TextChannel) => {
                    channel.send({ embeds: [embed] })
                })
            }
        } else if (prompt.includes("spotify"))
        {
            let spotify_data:any = (await Play.spotify(prompt))

            if (spotify_data.type == "playlist") {
                message.reply("this can take a while please wait while the bot adds all the songs")
                let tracks = await spotify_data.all_tracks()
                let n = 0
                for await (const track of tracks) {
                    n++
                    let raw_data = await Play.search(`${track.name} ${track.artists[0].name}`)
                    let video = raw_data[0]
                    
                    let video_data = {
                        title: video.title,
                        url: video.url,
                        duration: video.durationRaw,
                        thumbnail: video.thumbnails[0].url,
                        channel: video.channel.name
                    }
                    let songs = GuildAudio.songs
                    songs.set(songs.size, video_data)
                    logger("Added song", video.title, `${n} / ${spotify_data.tracksCount}`)
                    if (songs.size == 1 && audioPlayer.state.status == "idle") {
                        let song: SongData = GuildAudio.songs.get(0)
                        GuildAudio.textChannelID = message.channelId
                        playSong(song, bot, guildID)
                    }
                }
                const embed = new Builder.EmbedBuilder()
                embed.setTitle(spotify_data.name)
                embed.setDescription("`[ Songs: " + spotify_data.tracksCount + " ]`")
                embed.setThumbnail(spotify_data.thumbnail.url)
                embed.setAuthor({name: "Added playlist"})
                embed.setURL(spotify_data.url)
                embed.setColor(5763719)
            
                bot.client.channels.fetch(GuildAudio.textChannelID).then((channel:Discord.TextChannel) => {
                    channel.send({ embeds: [embed] })
                })
                
            } else if (spotify_data.type == "track") {
                let raw_data = (await Play.search(`${spotify_data.name} ${spotify_data.artists[0].name}`))
                let yt_info = raw_data[0]

                let video_data = {
                    title: yt_info.title,
                    url: yt_info.url,
                    duration: yt_info.durationRaw,
                    thumbnail: yt_info.thumbnails[0].url,
                    channel: yt_info.channel.name
                }
                let songs = GuildAudio.songs
                songs.set(songs.size, video_data)

                const embed = new Builder.EmbedBuilder()
                embed.setTitle(yt_info.title)
                embed.setDescription("`[ 00:00 | " + yt_info.durationRaw + " ]`")
                embed.setThumbnail(yt_info.thumbnails[0].url)
                embed.setAuthor({name: "Added song"})
                embed.setURL(yt_info.url)
                embed.setColor(5763719)
            
                bot.client.channels.fetch(GuildAudio.textChannelID).then((channel:Discord.TextChannel) => {
                    channel.send({ embeds: [embed] })
                })
            }
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

        if (audioPlayer.state.status == "idle") {
            let song: SongData = GuildAudio.songs.get(0)
            GuildAudio.textChannelID = message.channelId
            playSong(song, bot, guildID)
        }
    }
}