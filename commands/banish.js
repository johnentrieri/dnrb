const { SlashCommandBuilder} = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banish')
		.setDescription('Banishes the bot from the test server'),
	async execute(interaction) {

        // Find the connection
        const connection = await getVoiceConnection(interaction.guildId); 

        // Exit if bot is not part of a VoiceChannel
        if (!connection) { 
            interaction.reply("I'm not currently in a Voice Channel"); 
            return;
        }
        
        // Destroy the connection
        await connection.destroy();    

        // Say goodbye
        interaction.reply("See ya later!");     
         
	},
};
