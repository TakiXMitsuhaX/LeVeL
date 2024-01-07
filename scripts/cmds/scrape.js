const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  config: {
    name: 'scrape',
    aliases: ['scrape'],
    version: '1.1',
    author: 'RazihelX',
    role: 0,
    category: 'Utility',
    shortDescription: {
      en: 'Scrape information from a URL'
    },
    longDescription: {
      en: 'Scrape information from a URL and return it to the chat'
    },
    guide: {
      en: '{pn} <url>'
    }
  },
  onStart: async function({ api, event, args, message }) {
    // Construct the URL from the command arguments
    
    const url = args[0];
    if (!url)
      return message.reply(`Please input a valid URL!`);
    else {
      try {
        const validator = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        }
      });
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content');
        const headers = $('h1, h2, h3, h4, h5, h6').text();
        const websiteParagraphs = $("p").map((i, el) => $(el).text()).get();
        
        api.sendMessage(
          `- Title: ${title}\n
          - Description: ${description}\n
          - Headers: ${headers}
          - Paragraphs: ${websiteParagraphs.join("")}`,
           event.threadID,
           event.messageID
        );
      } catch (error) {
        console.error(error);
        message.reply(`There was an error processing the URL. Please try again later.`);
      }
    }
  },
};