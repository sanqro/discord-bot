import cron from "node-cron";
import fetch from "node-fetch"; // for older versions of node.js
import { EmbedBuilder } from "@discordjs/builders";

function motd(client) {
    //            "s m h d M y"
    cron.schedule("0 0 8 * * *", async () => {
        try {
            const fact = await getFact();
            const channel = client.channels.cache.get("1077507634862772314");
            const embed = createEmbed(fact.text, fact.source, fact.source_url);
            channel.send(embed);
        } catch (error) {
            console.error(error);
        }
    });
    console.log("Successfully scheduled MOTD.");
}

async function getFact() {
    try {
        const fact = await fetch("https://uselessfacts.jsph.pl/today.json", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });
        const factJson = await fact.json();
        return factJson;
    } catch (error) {
        console.log(error.message);
    }
}

function createEmbed(text, source, url) {
    const embed = new EmbedBuilder()
        .setColor(0xc8f542)
        .setTitle("Message of the Day!")
        .setURL(url)
        .setDescription("MOTD")
        .addFields({ name: "Useless fact of today:", value: text })
        .setTimestamp()
        .setFooter({ text: "Source: " + source, iconURL: null });

    return { embeds: [embed] };
}

export default motd;
