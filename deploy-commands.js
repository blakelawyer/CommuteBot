const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const token = process.env.DISCORD_TOKEN;
let dbParams = {};
dbParams.user = process.env.DB_USER;
dbParams.pass = process.env.DB_PASSWORD;
dbParams.host = process.env.DB_HOST;
dbParams.db = process.env.DATABASE
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log("Loading: " + file);
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		try { 
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
		} catch (e) { 
			console.log(e)
			errors = e.rawError.errors;
			for(const err in errors) { 
				console.log(e.rawErrors.errors[err]);
			}
		}
		

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
