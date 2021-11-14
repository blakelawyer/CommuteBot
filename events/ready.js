const { driverChannel } = require("../config.json");

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.guilds.fetch()
			.then((guilds) => {
				for(const [gid, gld] of guilds) { 
					guild = client.guilds.cache.get(gid);
					let foundRideRequest = false;
					let foundRideCat = false;
					let rideCatId = null;
					let foundDriverCat = false;
					let driverCatId = null;
					let foundDriverSide = false;


					let channels = guild.channels.cache;
					for(const [cid, chan] of channels) {
						if (chan.type === "GUILD_TEXT" && chan.name === "ride-request") { 
							foundRideRequest = true;
						} else if (chan.type === "GUILD_TEXT" && chan.name === "driver-side") { 
							foundDriverSide = true;
						} else if (chan.type === "GUILD_CATEGORY" && chan.name === "commuter-category") { 
							foundRideCat = true;
							rideCatId = chan.id;
						} else if (chan.type === "GUILD_CATEGORY" && chan.name === "driver-category") { 
							foundDriverCat = true;
							driverCatId = chan.id;
						}
					}

					if (!foundDriverCat) { 
						console.log("Creating driver-category")
						guild.channels.create('driver-category', { type: 'GUILD_CATEGORY' } )
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
						console.log("driver-category exists, checking for driver-side")
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

					if (!foundRideCat) { 
						console.log("Creating commuter-category")
						guild.channels.create('commuter-category', { type: 'GUILD_CATEGORY' } )
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
						console.log("commuter-category exists, checking for ride-request")
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