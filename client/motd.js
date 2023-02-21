import cron from "node-cron";
import fetch from "node-fetch";

function motd(client) {
    cron.schedule("*/5 * * * * *", async () => {
        const fact = await getFact();
        const channel = client.channels.cache.get("1077507634862772314");
        channel.send(fact);
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
        return factJson.text;
    } catch (error) {
        console.log("error");
        console.log(error.message);
    }
}

export default motd;
