const { SlashCommandBuilder} = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource  } = require('@discordjs/voice');
const { join } = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('carl')
		.setDescription('Plays a test recording'),
	async execute(interaction) {

        // Create placeholder for ID of VoiceChannel that summoning user is in
        let summonerChannelID = null;

        // Get ID of summoning user
        const summonerID = interaction.user.id;

        // Fetch list of channels within the guild
        const channels = await interaction.guild.channels.fetch();

        // Loop through each channel
        channels.forEach( (channel) => {

            // Only consider VoiceChannels
            if (channel.isVoiceBased()) {

                // Loop through each member within the channel
                channel.members.forEach( (member) => {

                    // If summoning user is a member of the channel
                    if (member.id == summonerID) {
                        
                        // Save off VoiceChannel ID for joining
                        summonerChannelID = channel.id;
                    };
                })
            }
        })

        // Exit if summoning user is not in a VoiceChannel
        if (!summonerChannelID) { 
            interaction.reply("You must be in a Voice Channel to summon me!"); 
            return;
        }

        // Join the VoiceChannel unmuted
        const connection = await joinVoiceChannel({
            channelId: summonerChannelID,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfMute: false
        });

        // Create an AudioPlayer
        const player = await createAudioPlayer();

        // Subscribe the VoiceConnection to the AudioPlayer
        await connection.subscribe(player);

        // Create an AudioResource from carl.mp3 in root (parent) directory
        const resource = await createAudioResource(join(__dirname,'..','carl.mp3'));

        // Play the AudioResource
        player.play(resource);
        player.on('error', error => { console.error('Error:', error.message); });

        // Destroy connection after a few seconds
        setTimeout(() => { connection.destroy(); }, 4000);

        // Reply to command
        interaction.reply("It don't matter, none of this matters...");  
	}
};
