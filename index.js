
// Require the necessary discord.js classes
const fs = require('fs');
const mongoose = require('mongoose');
const { Client, Collection, Intents } = require('discord.js');

const { token, dbParams } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); 
const { MessageActionRow, MessageButton } = require('discord.js');
const bh = require('./events/buttonHandler.js');

client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) { 
		bh.buttonHandler(interaction);
	}
	
	
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'buttontest') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);

		await interaction.reply({ content: 'Buttons!', components: [row] });
	}
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (args) => event.execute(args));
	} else {
		client.on(event.name, (args) => event.execute(args));
	}
}


// Connect to MongoDB
mongoose.connect("mongodb+srv://" + dbParams['user'] + ":" + dbParams['pass'] + "@" + dbParams['host'] + "/" + dbParams['db'] + "?retryWrites=true&w=majority");

// Login to Discord with your client's token
client.login(token);
