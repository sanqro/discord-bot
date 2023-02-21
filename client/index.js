import * as commandsLib from "./commands/index.js";
import motd from "./motd.js";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

// create new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// import command files
client.commands = new Collection();

// eslint-disable-next-line no-unused-vars
for (const [key, value] of Object.entries(commandsLib)) {
    if ("data" in value && "execute" in value) {
        client.commands.set(value.data.name, value);
    } else {
        console.log(
            `[WARNING] The command at ${value.data.name} is missing a required "data" or "execute" property.`
        );
    }
}

// code to run as soon as client is ready
client.once(Events.ClientReady, (e) => {
    console.log("Logged in as: " + e.user.tag);
    motd(client); // schedules message of the day
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true
        });
    }
});

// log in with bot client's token
client.login(process.env.TOKEN);
