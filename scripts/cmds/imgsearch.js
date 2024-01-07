const axios = require('axios');

module.exports = {
  config: {
    name: 'imgsearch',
    aliases: ['imgsearch'],
    version: '1.2',
    author: 'razihelX',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Searches Google Images for a given query.'
    },
    longDescription: {
      en: 'Searches Google Images for a given query and returns a list of image results.'
    },
    guide: {
      en: '{pn}<query>'
    }
  },
  onStart: async function ({ api, event, args, message }) {
    
    const query = args.join(' ');
    if (!query) return message.reply(`Please provide a search query.`);

    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        q: query,
        searchType: 'image',
        num: 10,
        key: 'AIzaSyCUl1SslI9HXtKuzeAbd6AO95y--Dw0YrY ',
        cx: 'b621b21bbd87349c7'
      }
    });

    const imageURLs = response.data.items.map(item => item.link);

    const streams = await Promise.all(imageURLs.map(url => global.utils.getStreamFromURL(url)));

    const imageLinks = imageURLs.map((link, index) => `image ${index + 1}: ${link}`).join('\n');

    api.sendMessage({
      body:
        `Image Results for: ${query}\n\n${imageLinks}`,
      attachment: streams,
    }, event.threadID, event.messageID);
  }
};
