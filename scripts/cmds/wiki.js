const axios = require('axios');

module.exports = {
  config: {
    name: 'wiki',
    aliases: ['wikipedia'],
    version: '1.3',
    author: 'razihelX',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Searches Wikipedia for a summary of a given topic'
    },
    longDescription: {
      en: 'Searches Wikipedia for a summary of a given topic and returns the first few sentences, as well as a picture'
    },
    usage: {
      en: "{pn} <topic>"
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const topic = args.join(' ');
    if (!topic) {
      return message.reply(`Please provide a topic to search for.`);
    }

    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    try {
      const response = await axios.get(apiUrl);
      const summary = response.data.extract;
      const thumbnail = response.data.thumbnail?.source;

      const message = {
        body: summary,
      };

      if (thumbnail) {
        message.attachment = await global.utils.getStreamFromURL(thumbnail);
      }

      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error(error);
      message.reply("Error fetching the api.");
    }
  }
};