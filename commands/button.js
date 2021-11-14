const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('Button test!'),
	async execute(interaction) {
		let buttonTest = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("button")
					.setLabel("this is a button")
					.setStyle("DANGER")
			)
		interaction.reply({
			content: "This is a button test!", 
			components: [buttonTest]
			// ephemeral: true
		})
	}
};
