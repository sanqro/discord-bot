import { REST, Routes } from "discord.js";
import * as commandsLib from "./commands/index.js";
import * as dotenv from "dotenv";
dotenv.config();

const commands = [];

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
// eslint-disable-next-line no-unused-vars
for (const [key, value] of Object.entries(commandsLib)) {
    commands.push(value.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands
        });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
