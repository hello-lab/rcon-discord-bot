require('dotenv').config();
const { Client, GatewayIntentBits ,Collection } = require('discord.js');
const Rcon  = require('rcon-srcds').default;
const fs = require('fs');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
DB_FILE = './data.json';
const rcon = new Rcon ({
  host: '69.62.78.191',
  port: 27016,
  password: 'INSERT RCON PASSWORD HERE'
});


client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}


client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!rcon ')) {
    const rawData = fs.readFileSync(DB_FILE);
    let data = JSON.parse(rawData);
    data.sudoUsers = data.sudoUsers || [];
    if (!data.sudoUsers.includes(message.author.id)) {
        return message.reply({ content: 'Fuk u', ephemeral: true });
    }
    const command = message.content.slice(6);
    console.log(command)
    try {
         rcon.authenticate('INSERT RCON PASSWORD HERE').then(()=>
           rcon.execute(command).then(response => {
               message.reply(`RCON Response:\n\`\`\`${response}\`\`\``);
                 rcon.disconnect();
           }).catch(err => {
               message.reply('Failed to send RCON command.');
               console.error(err);
           })
)
         
       
    } catch (err) {
      message.reply('Failed to send RCON command.');
      console.error(err);
    }
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ There was an error executing that command!', ephemeral: true });
  }
});



client.login(process.env.DISCORD_TOKEN)
