const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
DB_FILE = './data.json';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('su')
    .setDescription('Gives user su permissions.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to allow')
        .setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id !== '658666010890600448'&&interaction.user.id !== '596421952378503196') {
      return interaction.reply({ content: 'Fuk u', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const rawData = fs.readFileSync(DB_FILE);
    let data = JSON.parse(rawData);
    data.allowedUsers = data.allowedUsers || [];
    if (!data.allowedUsers.includes(user.id)) {
      data.allowedUsers.push(user.id);
    }
    data.sudoUsers = data.sudoUsers || [];
    if (!data.sudoUsers.includes(user.id)) {
      data.sudoUsers.push(user.id);

      fs.writeFileSync(DB_FILE, JSON.stringify(data));
          await interaction.reply({ content: `Gave su to <@${user.id}> `,ephemeral: true });

      return
    }

    await interaction.reply({ content: ` <@${user.id}> is already su, u dumdum` ,ephemeral: true});
  },
};
