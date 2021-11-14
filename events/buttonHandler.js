const Discord = require("discord.js");
const Ride = require("../model/ride.js");
const RidesCategory = require("../model/ridesCategory.js");
const colors = require("../model/colors.js");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    buttonHandler: async function(interaction) {
        messageId = interaction.message.id;
        let driverMsgRides = await Ride.find({ driverMessageId: messageId })
        let ticketChannelMsgs = await Ride.find({ ticketChannelMsg: messageId })
        if (driverMsgRides.length == 0 && ticketChannelMsgs.length == 0) { // Rider cancelled
            var server = interaction.guild;
            let rides = await Ride.find({ requestMessageId: messageId })
            let ride = rides[0]
            console.log("Rider cancelled")
            console.log(ride)
            
            const drivechannel = guild.channels.cache.get(ride.driverChannel);
            const ridechannel = guild.channels.cache.get(ride.riderChannel);
            
            const driveMessage = drivechannel.messages.cache.find(m => m.id == ride.driverMessageId);
            const rideMessage = ridechannel.messages.cache.find(m => m.id == ride.requestMessageId);
            
            driveMessage.embeds[0].setColor(colors.RED);
            driveMessage.components[0].components[0].setDisabled();
            
            driveMessage.edit({
                embeds: driveMessage.embeds,
                components: driveMessage.components
            }).then(() => { 
                ride.cancelTime = Date.now();
                ride.save();
            })

            interaction.reply({
                content: "Okay, I've cancelled your request.",
                ephemeral: true
            });

            if (ride.ticketChannel) { 
                const ticketChannel = server.channels.cache.get(ride.ticketChannel);
                ticketChannel.delete();
            }
        } else if (driverMsgRides.length > 0) { // Driver Accepted
            let ride = driverMsgRides[0]
            var server = interaction.guild;
            var rider, driver;
            var riderMessage, driverMessage;

            console.log("Driver accepted")
            ride.driverId = interaction.user.id;
            
            console.log(ride)
            console.log(interaction.guild.id);
            let rcs = await RidesCategory.findOne({ guildId: interaction.guild.id });
            let parentId = rcs.categoryId
            let parentCategory = server.channels.cache.get(parentId);

            server.members.fetch({ user : [ride.driverId, ride.riderId], withPresences: true })
                .then((user) => {
                    for (const [key, value] of user) {
                    
                        if (key == ride.driverId) {
                            driver = value.user.username;
                        }
                        if (key == ride.riderId) {
                            rider = value.user.username;
                        }
                    }

                    const drivechannel = guild.channels.cache.get(ride.driverChannel);
                    const ridechannel = guild.channels.cache.get(ride.riderChannel);
                    
                    console.log('outputting driverchannel');
                    console.log(drivechannel);
                    console.log('outputting riderchannel');
                    console.log(ridechannel);
                    
                    const driveMessage = drivechannel.messages.cache.find(m => m.id == ride.driverMessageId);
                    const rideMessage = ridechannel.messages.cache.find(m => m.id == ride.requestMessageId);
                    
                    console.log('outputting driveMessage');
                    console.log(driveMessage);
                    console.log('outputting rideMessage');
                    console.log(rideMessage);
                    
                    embed = makeEmbed(ride, driveMessage.member.displayAvatarURL(), interaction.member.displayName);
                    server.channels.create(rider + '-' + driver, {  //create channel
                        type: 'text',
                        permissionOverwrites: [  //set perms for only mods, admins, owner, and bot to see
                            {
                                id: '909112627777659000', //bot 
                                allow: ['VIEW_CHANNEL'],
                            },
                            {
                                id: ride.driverId,  //driver
                                allow: ['VIEW_CHANNEL'],
                            },
                            {
                                id: ride.riderId,  //rider
                                allow: ['VIEW_CHANNEL'],
                            },
                            {
                                id: server.id,  //everyone
                                deny: ['VIEW_CHANNEL'],
                            },
                        ],
                    }).then((ticketChannel) => {
                        let buttons = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                    .setCustomId("picked-up")
                                    .setLabel("Picked Up")
                                    .setStyle("PRIMARY"),
                                new MessageButton()
                                    .setCustomId("cancel")
                                    .setLabel("Cancel")
                                    .setStyle("DANGER"),
                            ])
                        ticketChannel.setParent(parentCategory)
                        ticketChannel.send({
                            embeds: [embed],
                            components: [buttons]
                        }).then((msg) => { 
                            ride.ticketChannel = msg.channel.id;
                            ride.ticketChannelMsg = msg.id;
                            ride.save();
                        })
                    })
                    
                    // driveMessage.edit();
                    driveMessage.embeds[0].setColor(colors.GREEN);
                    driveMessage.embeds[0].fields[3].value = interaction.member.displayName;
                    driveMessage.components[0].components[0].setDisabled();
                    
                    driveMessage.edit({
                        embeds: driveMessage.embeds,
                        components: driveMessage.components
                    })
                })
                .catch((ex) => {
                    console.log(ex)
                });
            
        } else if (ticketChannelMsgs.length > 0) { 
            let ride = ticketChannelMsgs[0]
            let server = interaction.guild
            const ticketChannel = server.channels.cache.get(ride.ticketChannel);
            const ticketMessage = ticketChannel.messages.cache.find(m => m.id == ride.ticketChannelMsg);
            console.log(ride);
            if (interaction.customId == "picked-up") { 
                console.log("Picked up!")
                let embed = ticketMessage.embeds[0]

                let buttons = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                        .setCustomId("dropped-off")
                        .setLabel("Dropped Off")
                        .setStyle("PRIMARY"),
                    new MessageButton()
                        .setCustomId("cancel")
                        .setLabel("Cancel")
                        .setStyle("DANGER"),
                ])


                ticketMessage.delete()
                ticketChannel.send({
                    embeds: [embed],
                    components: [buttons]
                }).then((msg) => { 
                    ride.ticketChannelMsg = msg.id
                    ticketMessage.channel.send("Buckle up, drive safe.")
                    ride.save();
                    ride.pickupTime = Date.now();
                    console.log("Pickup routine complete")
                })
                
            } else if (interaction.customId == "cancel") { 
                const drivechannel = guild.channels.cache.get(ride.driverChannel);
                const driveMessage = drivechannel.messages.cache.find(m => m.id == ride.driverMessageId);
                
                driveMessage.embeds[0].setColor(colors.RED);
                driveMessage.components[0].components[0].setDisabled();
                
                driveMessage.edit({
                    embeds: driveMessage.embeds,
                    components: driveMessage.components
                }).then(() => { 
                    ride.cancelTime = Date.now();
                    ride.save();
                })

                if (ride.ticketChannel) { 
                    const ticketChannel = server.channels.cache.get(ride.ticketChannel);
                    ticketChannel.delete();
                }
                console.log("Ride cancelled from Ticket Channel");
            } else if (interaction.customId == "dropped-off") { 
                interaction.guild.channels.cache.get(ride.ticketChannel).delete()
                ride.dropoffTime = Date.now();
                ride.save();
            }
        }
    }

};

function makeEmbed(ride, avUrl, driverName) {
	let embed = new Discord.MessageEmbed();
    embed.setTitle("Ride Request");
    embed.setTimestamp();
    embed.setColor(colors.GREEN);
    embed.setFooter("Comet Commute v1");
	embed.setThumbnail(avUrl);
	embed.addField("Ride ID", ride._id.toString());
	embed.addField("Current Location", ride.startLocation);
	embed.addField("Destination Location", ride.endLocation);
	embed.addField("Assigned Driver", driverName);

	return embed;
}


