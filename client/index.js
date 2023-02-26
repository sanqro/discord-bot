import * as commandsLib from "./commands/index.js";
import { Client, Collection, Events, GatewayIntentBits, Partials } from "discord.js";
import * as dotenv from "dotenv";
import AntiSpam from "discord-anti-spam";
import mongoose from "mongoose";
import { Warning } from "./commands/warn.js";
dotenv.config();

// The following code for mongoose was sourced from this url:
// https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/discordbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// create new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Channel]
});

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
            content: "Beim Ausführen dieses Befehls ist ein Fehler aufgetreten.",
            ephemeral: true
        });
    }
});

const antiSpam = new AntiSpam({
    warnThreshold: 3,
    muteThreshold: 100000000,
    kickThreshold: 100000000,
    banThreshold: 100000000,
    warnMessage: "Hör auf zu spammen!",
    verbose: true
});

client.on("messageCreate", (message) =>
    antiSpam.message(message).then((bool) => {
        if (bool) {
            warn(`<@${message.author.id}>`, "Spam");
        }
    })
);

const warn = async (target, reason) => {
    const warning = new Warning({
        target,
        reason
    });

    // save warning data do the database
    await warning.save();
};

// log in with bot client's token
client.login(process.env.TOKEN);
