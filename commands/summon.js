const { SlashCommandBuilder} = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('summon')
		.setDescription('Summon the bot to the current voice channel'),
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

        // Join VoiceChannel unmuted
        joinVoiceChannel({
            channelId: summonerChannelID,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfMute: false
        });
            
        // Say Hi
        interaction.reply("Hello!");     
	},
};
