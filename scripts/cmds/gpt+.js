const axios = require("axios");

module.exports = {
  config: {
    name: "ailine",
    aliases: ["ailine"],
    version: "1.0",
    author: "jfhigtfdv",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "GPT with internet.",
    },
    category: "box chat",
    guide: {
      vi: "",
      en: "{pn} <content> - GPT with internet.",
    },
  },

  onStart: async function ({ message, event }) {
    return message.reply("This command doesn't need prefix");
  },
  
  onChat: async function ({ api, args, message, event, response }) {
    if (event.body.toLowerCase().split(' ')[0] == 'ailine') {
      try {
        const text = args.slice(1).join(" ");
        if (!text) {
          api.sendMessage("Please provide a prompt.", event.threadID);
          return;
        }
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        const bing = await axios.get(`https://gptplus.saludeskim1.repl.co/request?args=${text}`);
        const clean = bing.data.message.replace(/\[\^\d+\^\]/g, '');
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        await api.sendMessage(clean, event.threadID);
        
      } catch (error) {
        console.error(error);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        api.sendMessage("Failed.", event.threadID);
      }
    }
  }
};