import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import mongoose from "mongoose";

// The following code for mongoose was sourced from this url:
// https://www.geeksforgeeks.org/how-to-connect-node-js-to-a-mongodb-database/

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/discordbot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const warningSchema = new Schema({
    target: String,
    reason: String
});

export const Warning = mongoose.model("warnings", warningSchema);

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warns  the user you enter as a target")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Warns the user you enter as a target")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("You can optionally provide a reason for the warn here.")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "No reason specified.";

        const warning = new Warning({
            target,
            reason
        });

        // save warning data do the database
        await warning.save();

        await interaction.reply(`Warned ${target.username} for: ${reason}`);
    }
};
