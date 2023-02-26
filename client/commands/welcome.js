import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("welcome")
        .setDescription("Welcomes a user")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Welcomes the user you enter as a target")
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        await interaction.reply(`Welcome ${target.username} to the server!`);
    }
};
