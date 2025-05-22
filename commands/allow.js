const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
DB_FILE = './data.json';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('allow')
    .setDescription('Allow a user to send messages.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to allow')
        .setRequired(true)),
  async execute(interaction) {
   
    const user = interaction.options.getUser('user');
    const rawData = fs.readFileSync(DB_FILE);
    let data = JSON.parse(rawData);
 if (interaction.user.id !== '658666010890600448'&&interaction.user.id !== '596421952378503196'&&data.allowedUsers.includes(interaction.user.id)) {
      return interaction.reply({ content: 'Fuk u', ephemeral: true });
    }
    data.allowedUsers = data.allowedUsers || [];
    if (!data.allowedUsers.includes(user.id)) {
      data.allowedUsers.push(user.id);
   
      fs.writeFileSync(DB_FILE, JSON.stringify(data));
          await interaction.reply({ content: `Allowed <@${user.id}> `,ephemeral: true });

      return
    }

    await interaction.reply({ content: ` <@${user.id}> is already allowed, u dumdum` ,ephemeral: true});
  },
};
