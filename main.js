require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const Rcon = require("rcon-srcds").default;
const fs = require("fs");
const ai = require("./ai.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
DB_FILE = "./data.json";
const rcon = new Rcon({
  host: "69.62.78.191",
  port: 27016,
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!rcon ")) {
    const rawData = fs.readFileSync(DB_FILE);
    let data = JSON.parse(rawData);
    data.sudoUsers = data.sudoUsers || [];
    if (!data.sudoUsers.includes(message.author.id)) {
      return message.reply({ content: "Fuk u", ephemeral: true });
    }
    const command = message.content.slice(6);
    console.log(command);
    try {
      rcon
        .authenticate("2suSukDiHGDl")
        .then(() =>
          rcon
            .execute(command)
            .then(async (response) => {
              message.reply(`RCON Response:\n\`\`\`${response}\`\`\``);
              if (response.includes("Unknown")) {
                const sentMessage = await message.reply({
                  content: "Processing...",
                  fetchReply: true,
                });

                ai(response).then(async (res) => {
                  res = JSON.parse(res);
                  console.log(res);
                  // Edit it later
                  await sentMessage.edit(
                    `AI Response:\n\`\`\`${res["help_text"]}\`\`\`\n Suggested Command: \`${res["command"]}\`\n\n Type \`yes\` or \`y\` within 15s to execute suggested command`
                  );
                  const filter = (m) => m.author.id === message.author.id;
                  try {
                    const collected = await message.channel.awaitMessages({
                      filter,
                      max: 1,
                      time: 15000,
                      errors: ["time"],
                    });
                    const reply = collected.first().content;
                    if (
                      reply.toLowerCase() === "yes" ||
                      reply.toLowerCase() === "y"
                    )
                      rcon.authenticate("2suSukDiHGDl").then(() =>
                        rcon.execute(res["command"]).then((response) => {
                          message.reply(
                            `RCON Response:\n\`\`\`${response}\`\`\``
                          );
                          rcon.disconnect();
                        })
                      );
                  } catch (e) {
                    //await message.followUp('⏰ You didn’t reply in time.');
                  }
                });
              }
              rcon.disconnect();
            })
            .catch((err) => {
              message.reply("Failed to send RCON command.");
              console.error(err);
            })
        )
        .catch((err) => {
          if (err.includes("Already authenticated")) {
            () =>
              rcon
                .execute(command)
                .then(async (response) => {
                  message.reply(`RCON Response:\n\`\`\`${response}\`\`\``);
                  if (response.includes("Unknown")) {
                    const sentMessage = await message.reply({
                      content: "AI is Processing...",
                      fetchReply: true,
                    });

                    ai(response).then(async (res) => {
                      res = JSON.parse(res);
                      console.log(res);
                      // Edit it later
                      await sentMessage.edit(
                    `AI Response:\n\`\`\`${res["help_text"]}\`\`\`\n Suggested Command: \`${res["command"]}\`\n\n Type \`yes\` or \`y\` within 15s to execute suggested command`
                      );
                      const filter = (m) => m.author.id === message.author.id;
                      try {
                        const collected = await message.channel.awaitMessages({
                          filter,
                          max: 1,
                          time: 15000,
                          errors: ["time"],
                        });
                        const reply = collected.first().content;
                        if (
                          reply.toLowerCase() === "yes" ||
                          reply.toLowerCase() === "y"
                        )
                          rcon.authenticate("2suSukDiHGDl").then(() =>
                            rcon.execute(res["command"]).then((response) => {
                              message.reply(
                                `RCON Response:\n\`\`\`${response}\`\`\``
                              );
                              rcon.disconnect();
                            })
                          );
                      } catch (e) {
                        //await message.followUp('⏰ You didn’t reply in time.');
                      }
                    });
                  }
                  rcon.disconnect();
                })
                .catch((err) => {
                  message.reply("Failed to send RCON command.");
                  console.error(err);
                });
          }
        });
    } catch (err) {
      message.reply("Failed to send RCON command.");
      console.error(err);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ There was an error executing that command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
