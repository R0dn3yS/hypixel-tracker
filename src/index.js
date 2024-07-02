const { default: axios } = require('axios');
const { Client, IntentsBitField, Collection, ActivityType } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const prefix = '$';

const client = new Client({
  intents: new IntentsBitField().add(3276799),
});

const hypixel = axios.create({
  baseURL: 'https://api.hypixel.net',
  headers: {
    'API-Key': process.env.HYPIXEL_API,
  }
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.admins = ['325254775828512778'];

['command'].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.once('ready', () => {
  console.log(`${client.user.username} is ready on ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    activities: [{
      name: 'Hypixel Skyblock',
      type: ActivityType.Playing,
    }],
  });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args, hypixel);
});

client.login(process.env.DISCORD_TOKEN);