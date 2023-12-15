const bannedWord = [
    "<",
    ">",
    "http"
];

const badges = {
    broadcaster: "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/1",
    moderator: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1",
    subscriber: "https://cdn-icons-png.flaticon.com/512/929/929424.png",
    premium: "https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1",
    "no_audio": "https://static-cdn.jtvnw.net/badges/v1/aef2cd08-f29b-45a1-8c12-d44d7fd5e6f0/1",
    "no_video": "https://static-cdn.jtvnw.net/badges/v1/199a0dba-58f3-494e-a7fc-1fa0a1001fb8/1",
    partener: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1",
    "glhf-pledge": "https://static-cdn.jtvnw.net/badges/v1/3158e758-3cb4-43c5-94b3-7639810451c5/1",
    "twitch-recap-2023": "https://static-cdn.jtvnw.net/badges/v1/4d9e9812-ba9b-48a6-8690-13f3f338ee65/1",
}

// const tmi = require("tmi.js");
const client = new tmi.Client({
	options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
	channels: [ "Sleezzi" ]
});
const setDate = () => {
    document.querySelector("#compteur").innerText = `${(new Date().getHours() > 9 ? new Date().getHours() : `0${new Date().getHours()}`)}:${(new Date().getMinutes() > 9 ? new Date().getMinutes() : `0${new Date().getMinutes()}`)}`;
}

client.on("clearchat", () => {
    document.querySelector("#chat > #messageContainer").innerHTML = "";
});

client.on("submysterygift", (channel, tags, methods) => {
    for (word of bannedWord) if (tags.username.toLowerCase().includes(word)) tags.username = message.toLowerCase().replace(word, ".".repeat(word.length));
    const speak = new SpeechSynthesisUtterance(tags.username);
    window.speechSynthesis.speak(speak);
});

client.on("message", (channel, tags, message, self) => {
    const isMod = tags.mod  || (tags.badges && tags.badges.brodcaster !== null)
    if ((message === "!clear" || message === "!cls") && isMod) return document.querySelector("#chat > #messageContainer").innerHTML = "";
    for (word of bannedWord) if (message.toLowerCase().includes(word)) message = message.toLowerCase().replace(word, "#".repeat(word.length));
    if (message.startsWith("!say") && isMod) {
        const speak = new SpeechSynthesisUtterance(message.split("!say ")[1]);
        window.speechSynthesis.speak(speak);
        return;
    }
    const messageContainer = document.createElement("div");
    messageContainer.className = "message";
    messageContainer.innerHTML = `
<div class="author">
    <div class="badges">${Object.keys(tags.badges).map(badge => (badge && badges[badge] ? `<img src="${badges[badge]}"></img>` : ""))}</div>
    <${(tags.mod || tags.subscriber ? "strong" : "span")} style="color: ${tags.color};">${tags.username}:</${(tags.mod || tags.subscriber ? "strong" : "span")}>
</div>
<div class="content">
    <${(tags.mod || tags.subscriber ? "strong" : "span")}>${message}</${(tags.mod || tags.subscriber ? "strong" : "span")}>
</div>`;
    document.querySelector("#chat > #messageContainer").appendChild(messageContainer);
});

setDate();
setInterval(setDate, 30_000);

client.connect().then(() => document.querySelector("#await").classList.remove("active")).catch(err => console.error(err));