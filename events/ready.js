const { driverChannel } = require("../config.json");
const RidesCategory = require("../model/ridesCategory.js");
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.guilds.fetch()
			.then((guilds) => {
				for(const [gid, gld] of guilds) { 
					guild = client.guilds.cache.get(gid);
					let foundRideRequest = false;
					let foundCommuterCat = false;
					let rideCatId = null;
					let foundDriverCat = false;
					let driverCatId = null;
					let foundDriverSide = false;
					let foundRidesCat = false;
					let ridesCatId = null;

					let channels = guild.channels.cache;
					for(const [cid, chan] of channels) {
						if (chan.type === "GUILD_TEXT" && chan.name === "ride-request") { 
							foundRideRequest = true;
						} else if (chan.type === "GUILD_TEXT" && chan.name === "driver-side") { 
							foundDriverSide = true;
						} else if (chan.type === "GUILD_CATEGORY" && chan.name === "commuter-requests") { 
							foundCommuterCat = true;
							rideCatId = chan.id;
						} else if (chan.type === "GUILD_CATEGORY" && chan.name === "drivers-only") { 
							foundDriverCat = true;
							driverCatId = chan.id;
						} else if (chan.type === "GUILD_CATEGORY" && chan.name === "rides") { 
							foundRidesCat = true;
							ridesCatId = chan.id;
						}
					}

					if (!foundRidesCat) { 
						console.log("Creating rides")
						guild.channels.create('rides', { 
							type: 'GUILD_CATEGORY', 
							permissionOverwrites: [
								{
									id: '909112627777659000', //bot 
									allow: ['VIEW_CHANNEL'],
								},
								{
									id: guild.id,  //everyone
									deny: ['VIEW_CHANNEL'],
								},
							],
						})
						.then((cat) => {
							let rc = new RidesCategory({
								guildId: gid,
								categoryId: cat.id
							})
							rc.save();
						})
						.catch((ex) => {
							console.log(ex)
						})	
					} else { 
						console.log("rides category exists")
					}

					if (!foundDriverCat) { 
						console.log("Creating drivers-only")
						guild.channels.create('drivers-only', { 
							type: 'GUILD_CATEGORY', 
							permissionOverwrites: [
								{
									id: '909112627777659000', //bot 
									allow: ['VIEW_CHANNEL'],
								},
								{
									id: '909111713197096980',  //driver
									allow: ['VIEW_CHANNEL'],
								},
								{
									id: guild.id,  //everyone
									deny: ['VIEW_CHANNEL'],
								},
							],
						})
						.then((cat) => { 
							if (!foundDriverSide) { 
								console.log("Creating driver-side")
								guild.channels.create('driver-side')
								.then((chan) => {
									chan.setParent(cat.id)
								})
							}
						})
						.catch((ex) => {
							console.log(ex)
						})					
					} else { 
						console.log("drivers-only exists, checking for driver-side")
						if (!foundDriverSide) { 
							console.log("Creating driver-side")
							guild.channels.create('driver-side')
							.then((chan) => {
								chan.setParent(driverCatId)
							})
							.catch((ex) => {
								console.log(ex)
							})	
						}
					}

					if (!foundCommuterCat) { 
						console.log("Creating commuter-requests")
						guild.channels.create('commuter-requests', { 
							type: 'GUILD_CATEGORY', 
							permissionOverwrites: [
								{
									id: '909112627777659000', //bot 
									allow: ['VIEW_CHANNEL'],
								},
								{
									id: '909111826384580619',  //rider
									allow: ['VIEW_CHANNEL'],
								},
								{
									id: guild.id,  //everyone
									deny: ['VIEW_CHANNEL'],
								},
							],
						})
						.then((cat) => { 
							if (!foundRideRequest) { 
								console.log("Creating ride-request")
								guild.channels.create('ride-request')
								.then((chan) => {
									chan.setParent(cat.id)
								})
								.catch((ex) => {
									console.log(ex)
								})	
							}
						})						
					} else { 
						console.log("commuter-requests exists, checking for ride-request")
						if (!foundRideRequest) { 
							console.log("Creating ride-request")
							guild.channels.create('ride-request')
							.then((chan) => {
								chan.setParent(rideCatId)
							})
							.catch((ex) => {
								console.log(ex)
							})	
						}
					}
				}
			})
			.catch((e) => {
				console.log(e);
			})
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

// TODO

// Create roles if they don't already exist
	// Driver role
	// Rider role