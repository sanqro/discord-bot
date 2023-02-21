import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Antwortet mit Pong, falls der Bot online ist."),
    async execute(interaction) {
        await interaction.reply("Pong!");
    }
};
