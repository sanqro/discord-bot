import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Heisst einen Benutzer willkommen")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Heisst einen Benutzer willkommen, den du angibst")
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        await interaction.reply(`Wilkommen ${target.username}!`);
    }
};
