const axios = require('axios');

module.exports = {
  config: {
    name: 'tempmail',
    aliases: ['tempmail'],
    version: '1.2',
    author: 'RazihelX',
    role: 0,
    category: 'media',
    shortDescription: {
      en: 'Generate Random Email-Temp'
    },
    longDescription: {
      en: 'Generate a random email or as temporary'
    },
    guide: {
      en: '{pn} '
    }
  },
  onStart: async function ({ api, event, args }) {

    if (args.length === 0) {
      api.sendMessage("🔴 Invalid Command, please use 'tempmail gen' to generate a random email address or 'tempmail inbox (email)' to view inbox messages.", event.threadID);
      return;
    }

    if (args[0] === "gen") {
      try {
        const response = await axios.get("https://hazeyy-api-tempmailv2.kyrinwu.repl.co/get");
        const responseData = JSON.stringify(response.data, null, 2);
        api.sendMessage(`[] 𝙏𝙚𝙢𝙥𝙢𝙖𝙞𝙡 ✉️ []\n\n ${responseData} `, event.threadID);
      } catch (error) {
        console.error("🔴 Error", error);
        api.sendMessage("🔴 Unexpected Error, while fetching email addresses...", event.threadID);
      }
    } else if (args[0].toLowerCase() === "inbox" && args.length === 2) {
      const email = args[1];
      // Check if 'email' is defined and is a string
      if (email && typeof email === 'string') {
        try {
          const response = await axios.get(`https://hazeyy-api-tempmailv2.kyrinwu.repl.co/get/${encodeURIComponent(email)}`);
          const inboxMessages = response.data;
          api.sendMessage(`[] 𝙏𝙚𝙢𝙥𝙢𝙖𝙞𝙡 𝙄𝙣𝙗𝙤𝙭 📩 []\n\n${JSON.stringify(inboxMessages, null, 2)}`, event.threadID);
        } catch (error) {
          console.error("🔴 Error", error);
          api.sendMessage("🔴 Unexpected Error, please try again later...", event.threadID);
        }
      } else {
        api.sendMessage("🔴 Invalid Command, please use 'tempmail gen' to generate a random email address or 'tempmail inbox (email)' to view inbox messages.", event.threadID);
      }
    }
  }
};
