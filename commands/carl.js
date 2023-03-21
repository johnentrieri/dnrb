const { SlashCommandBuilder} = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource  } = require('@discordjs/voice');
const { join } = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('carl')
		.setDescription('Plays a recording!'),
	async execute(interaction) {

        let summonerChannelID = null;
        const summonerID = interaction.user.id;
        const channels = await interaction.guild.channels.fetch();
        channels.forEach( (channel) => {
            if (channel.isVoiceBased()) {
                channel.members.forEach( (member) => {
                    if (member.id == summonerID) {
                        console.log("[CARL] Found Summoner, Joining Channel: " + channel.name);
                        summonerChannelID = channel.id;
                    };
                })
            }
        })
		const connection = joinVoiceChannel({
            channelId: summonerChannelID,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfMute: false
        });       


        const player = createAudioPlayer();
        connection.subscribe(player);
        const resource = createAudioResource(join(__dirname,'..','carl.mp3'));
        player.play(resource);

        player.on('error', error => {
            console.error('Error:', error.message, 'with track', error.resource.metadata.title);
        });


        interaction.reply("Done");   
        //connection.destroy();     
	},
};
