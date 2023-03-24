const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const {youtube} = require('@googleapis/youtube');
const youtubedl = require('youtube-dl-exec')
const { join } = require('node:path');

const resourceQueue = [];

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
        
        // Find the connection
        const connection = await getVoiceConnection(interaction.guildId);
        
        // Exit if bot is not part of a VoiceChannel
        if (!connection) { 
            interaction.editReply("I'm not currently in a Voice Channel"); 
            return;
        }

        // Create an AudioPlayer
        const audioPlayer = await createAudioPlayer();

        // Subscribe the VoiceConnection to the AudioPlayer
        await connection.subscribe(audioPlayer);

        // Get YouTube API Key from .env file
        require('dotenv').config();
        const ytAPIkey = process.env.YOUTUBE_API_KEY;

        // Authorize using API Key, OAuth2 not required for public searches
        const ytClient = youtube({ version: 'v3', auth: ytAPIkey });

        // Search YouTube using input query
        const searchResults = await ytClient.search.list({ part: 'id', q: query, type: 'video'});

        // Construct YouTube URL
        const videoID = searchResults.data.items[0].id.videoId;
        const ytURL = 'https://www.youtube.com/watch?v=' + videoID;

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

        // Create an AudioResource from MP3 file in audio directory
        const audioResource = await createAudioResource(join(__dirname,'..','audio', videoID + '.mp3'));

        // TODO - Queue the AudioResource
        /*
        resourceQueue.push(audioResource);
        console.log(resourceQueue.length);

        if ( resourceQueue.length <= 0) {
            interaction.editReply("Queue is Empty"); 
            return;
        }

        player.on(AudioPlayerStatus.Idle, () => {
            player.play(getNextResource());
        });
        */

        audioPlayer.play(audioResource);
        audioPlayer.on('error', error => { console.error('Error:', error.message); });
       
        interaction.editReply("Playing " + query );
	},
};
