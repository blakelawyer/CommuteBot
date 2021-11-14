const { SlashCommandBuilder } = require('@discordjs/builders');
const RidesCategory = require('../model/ridesCategory.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Delete all the channels in the server!!'),
	async execute(interaction) {
        console.log("Server nuked by " + interaction.member.displayName + " (" + interaction.member.id + ")");
		let channels = guild.channels.cache;
        for(const [cid, chan] of channels) {
            chan.delete();
        }
        await RidesCategory.deleteMany({ guildId: interaction.guild.id });
	},
};
