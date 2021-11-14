const Ride = require("../model/ride.js");

module.exports = {
    buttonHandler: async function(interaction) {
        messageId = interaction.message.id;
        let rides = await Ride.find({ driverMessageId: messageId })
        if (rides.length == 0) { // Rider cancelled
            let rides = await Ride.find({ requestMessageId: messageId })
            let ride = rides[0]
            console.log("Rider cancelled")
            console.log(ride)
            // Find the message in #driver-side, it's ID is ride.driverMessageid
                // update driverMessage to embed color red, and disable buttons.
            
            // Find the message to user, set embed color red, disable buttons.

        } else { // Driver Accepted
            let ride = rides[0]
            console.log("Driver accepted")
            console.log(ride)

            // Create a new channel that only this bot can see

            // Add the rider and driver to the channel

            // Disable the embed buttons
            
        }

    }
}