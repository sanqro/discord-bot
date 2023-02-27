import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Antwortet dir mit den verfügbaren Befehlen."),
    async execute(interaction) {
        const commands = [
            { name: "/help", description: "Zeigt diese Nachricht an!" },
            {
                name: "/warn [Benutzer] [Grund] <-- Optional",
                description: "Warnt einen bestimmten Nuter für einen Grund."
            },
            { name: "/warn [Benutzer] [Grund]", description: "Shows this message" }
        ];

        const commandList = commands.map((cmd) => `${cmd.name}: ${cmd.description}`).join("\n");

        await interaction.reply(`Hier sind alle verfügbaren Befehle: \n${commandList}`);
    }
};
