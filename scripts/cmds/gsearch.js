const axios = require('axios');

module.exports = {
  config: {
    name: 'gsearch',
    aliases: ['gsearch'],
    version: '1.1',
    author: 'razihelX',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Search for apps from playstore'
    },
    longDescription: {
      en: 'Search for apps from Google playstore'
    },
    guide: {
      en: 'Usage: {pn} <search_term> - <num_of_results>'
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const searchTerm = args.slice(0, args.indexOf('-')).join(' ').trim();
    const numResults = parseInt(args[args.indexOf('-') + 1]) || 10;

    if (!searchTerm) {
      api.sendMessage({
        body: '❗️ Please specify a search term.'
      }, event.threadID, event.messageID);
      return;
    }

    const uri = `https://api.foxzihel2.repl.co/gscraper/apps/search?term=${searchTerm}&num=${numResults}`;

    try {
      const response = await axios.get(uri);
      const apps = response.data;

      if (apps.length === 0) {
        api.sendMessage({
          body: `❗️ Could not find any apps for the search term "${searchTerm}".`
        }, event.threadID, event.messageID);
        return;
      }

      let messageBody = '';
      let attachments = [];

      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        const icon = app.icon;
        const [iconStream] = await Promise.all([
          global.utils.getStreamFromURL(icon)
        ]);

        attachments.push(iconStream);

        messageBody += `
📱 Title: ${app.title}
🔖 Appid: ${app.appId}
👨‍💼 Developer: ${app.developer}

💰 Price: ${app.price}
🔍 URL: ${app.url}
🌟 Score: ${app.scoreText} (${app.score})
`;
      }

      api.sendMessage({
        attachment: attachments,
        body: messageBody
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage({
        body: `❗️ An error occurred while searching for apps: ${error.message}`
      }, event.threadID, event.messageID);
    }
  }
};