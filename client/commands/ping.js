import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong if the bot is online."),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
