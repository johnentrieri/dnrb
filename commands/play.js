const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel } = require('@discordjs/voice');
const {youtube} = require('@googleapis/youtube');
const youtubedl = require('youtube-dl-exec')
const { join } = require('node:path');

const resourceQueue = [];
let emptyQueue = true;
let audioPlayer = null;
let connection = null;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Searches for media and plays the first result')
        .addStringOption( (option) => {
            option
                .setName('query')
                .setDescription('query to search for')
                .setRequired(true);

            return option;
        }),

	async execute(interaction) {

        // Defer so response beyond 3 seconds is permitted
        await interaction.deferReply();
        
        // Save input query string
        const query = interaction.options.getString('query');
        console.log("[PLAY] Received Search Query: " + query);
        
        // Find the connection or join VoiceChannel if connection does not exist
        connection = null;
        connection = await getVoiceConnection(interaction.guildId);
        if (!connection) { 

            console.log("[PLAY] No Active VoiceConnection, attempting to join VoiceChannel");

            // Create placeholder for ID of VoiceChannel that summoning user is in
            let summonerChannelID = null;

            // Get ID of summoning user
            const summonerID = interaction.user.id;

            // Fetch list of channels within the guild
            const channels = await interaction.guild.channels.fetch();

            // Loop through each channel to find Voice Channel where summoner is
            channels.forEach( (channel) => {
                if (channel.isVoiceBased()) {
                    channel.members.forEach( (member) => {
                        if (member.id == summonerID) {
                            summonerChannelID = channel.id;
                        };
                    })
                }
            })

            // Exit if summoning user is not in a VoiceChannel
            if (!summonerChannelID) { 
                console.log("[PLAY] Could not find summoner in a VoiceChannel");
                interaction.editReply("You must be in a Voice Channel to summon me!"); 
                return;
            }

            // Join VoiceChannel unmuted
            console.log("[PLAY] Found Summoner, joining VoiceChannel ");
            connection = await joinVoiceChannel({
                channelId: summonerChannelID,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfMute: false
            });


        }

        // Check if AudioPlayer already exists
        if (audioPlayer) {
            console.log("[PLAY] AudioPlayer Exists");
        } else {

            // Create an AudioPlayer
            console.log("[PLAY] AudioPlayer Does Not Exist, Creating & Subscribing");
            audioPlayer = await createAudioPlayer();

            // Subscribe the VoiceConnection to the AudioPlayer
            connection.subscribe(audioPlayer);

            // AudioPlayer Error Handling
            audioPlayer.on('error', error => {
                console.log("[PLAY] Exiting, Error Received: " + error)
                connection.destroy();
                return;                
            });

            // AudioPlayer - On Idle
            audioPlayer.on(AudioPlayerStatus.Idle, () => {
                console.log("[PLAY] AudioPlayer Entering Idle State")
                if (resourceQueue.length <= 0) {
                    emptyQueue = true;
                    console.log("[PLAY] Queue Empty, Waiting for Request")
                } else {
                    const audioResource = resourceQueue.shift();
                    audioPlayer.play(audioResource);
                }
                return;               
            });

            // AudioPlayer - On Playing
            audioPlayer.on(AudioPlayerStatus.Playing, () => {
                console.log("[PLAY] AudioPlayer Entering Playing State")
                return;               
            });

            // AudioPlayer - On Queue Updated
            audioPlayer.on('queue', () => {
                console.log("[PLAY] New Resource Added to Queue")
                if (resourceQueue.length > 0 && emptyQueue) {
                    emptyQueue = false;
                    const audioResource = resourceQueue.shift();
                    audioPlayer.play(audioResource);
                }
                return;               
            });
        }

        // Get YouTube API Key from .env file
        require('dotenv').config();
        const ytAPIkey = process.env.YOUTUBE_API_KEY;

        // Authorize using API Key, OAuth2 not required for public searches
        const ytClient = youtube({ version: 'v3', auth: ytAPIkey });

        // Search YouTube using input query
        const searchResults = await ytClient.search.list({ part: 'id', q: query, type: 'video'});

        if (!searchResults.data.items) {
            console.log("[PLAY] Error Retrieving Search Results");
            return;   
        }

        // Construct YouTube URL
        const videoID = searchResults.data.items[0].id.videoId;
        const ytURL = 'https://www.youtube.com/watch?v=' + videoID;
        console.log("[PLAY] URL of First Search Result: " + ytURL);

        // Download YouTube Audio as an MP3
        await youtubedl(ytURL, {
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true,
            extractAudio: true,
            o: './audio/%(id)s.%(ext)s',
            audioFormat: 'mp3',
            addHeader: [
                'referer:youtube.com',
                'user-agent:googlebot'
            ]
        });

        // Create and Queue AudioResource from MP3 file in audio directory
        const audioResource = await createAudioResource(join(__dirname,'..','audio', videoID + '.mp3'));
        resourceQueue.push(audioResource);
        audioPlayer.emit('queue');
        console.log("[PLAY] Added to Queue, Queue Length is: " + resourceQueue.length);
       
        interaction.editReply("Added " + ytURL + " to queue");
	},
};
