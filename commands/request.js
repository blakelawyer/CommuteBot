const { SlashCommandBuilder } = require('@discordjs/builders');
const Ride = require("../model/ride.js");
const Discord = require("discord.js");
const colors = require("../model/colors.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription('Request a ride!')
		.addStringOption(option =>
			option.setName('current_location')
				.setDescription('Where you are now')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('destination_location')
				.setDescription('Where do you need to go?')
				.setRequired(true)),
			
		// TODO Pre-schedule (v1.2)

	async execute(interaction) {
		console.log("Making request")
		const curr_loc = interaction.options.get("current_location").value;
		const dest_loc = interaction.options.get("destination_location").value;
		
		// interaction.message.channel.id ??
		const riderChan = interaction.channelId;

		let ride = new Ride({ 
			riderId: interaction.member.id,
			driverId: null,
			startLocation: curr_loc,
			endLocation: dest_loc,
			driverChannel: null,
			riderChannel: riderChan,
		});
		let embed = makeEmbed(ride, interaction.member.displayAvatarURL());
		let riderButtons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId("cancel")
				.setLabel("Cancel request")
				.setStyle("DANGER")
		)
		interaction.reply({
			content: "Ride requested!  We'll let you know when a driver has been assigned.", 
			//embeds: [embed],
			ephemeral: true,
			components: [riderButtons],
			fetchReply: true 
		}).then((reply) => { 
			console.log("Requested!")
			ride.requestMessageId = reply.id
			interaction.guild.channels.fetch()
			.then((channels) => {
				for(const [cid, chan] of channels) {
					if (chan.type === "GUILD_TEXT" && chan.name === 'driver-side') { 
						let buttons = new MessageActionRow()
							.addComponents([
								new MessageButton()
									.setCustomId("accept")
									.setLabel("Take Ride")
									.setStyle("PRIMARY")
								// new MessageButton()
								// 	.setCustomId("reject")
								// 	.setLabel("Reject")
								// 	.setStyle("DANGER")
							])
						chan.send({
							embeds: [embed],
							components: [buttons]
						}).then((driverMessage) => { 
							ride.driverMessageId = driverMessage.id;
							ride.driverChannel = chan.id;
							ride.save();
						})
						break;
					}
				}
			})
		});
	},
};

function makeEmbed(ride, avUrl) {
	let embed = new Discord.MessageEmbed();
    embed.setTitle("Ride Request");
    embed.setTimestamp();
    embed.setColor(colors.YELLOW);
    embed.setFooter("Comet Commute v1");
	embed.setThumbnail(avUrl);
	embed.addField("Ride ID", ride._id.toString());
	embed.addField("Current Location", ride.startLocation);
	embed.addField("Destination Location", ride.endLocation);
	embed.addField("Assigned Driver", "NONE");

	return embed;
}

