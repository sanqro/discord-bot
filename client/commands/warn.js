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
        .setDescription(
            "Warnt den Nutzer, den du als Ziel eingibst und fügt einen optionalen Grunde hinzu"
        )
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Warnt den Nutzer, den du als Ziel eingibst")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription(
                    "Du kannst dieses Feld optional für einen Grundangabe für die Warnung verwenden"
                )
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const target = interaction.options.getUser("target");
        const reason = interaction.options.getString("reason") ?? "Kein Grund wurde festgelegt.";

        const warning = new Warning({
            target,
            reason
        });

        // save warning data do the database
        await warning.save();

        const warningsAmount = async (target_id) => {
            return await Warning.find({ target: target_id }).exec();
        };

        console.log(await warningsAmount());

        await interaction.reply(`${target.username} wurde gewarnt für: ${reason}
        Dies ist Warnung #${(await warningsAmount(target)).length} für ${target.username}`);
    }
};
