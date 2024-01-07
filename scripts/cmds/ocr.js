const axios = require('axios');

module.exports = {
  config: {
    name: 'ocr',
    aliases: ['ocr'],
    version: '1.1',
    author: 'raxihelX',
    role: 0,
    category: 'AI',
    shortDescription: {
      en: 'Extract text from an image using OCR'
    },
    longDescription: {
      en: 'This command extracts text from the mentioned or replied image or from a given image' 
    },
    guide: {
      en: '{pn} [<image URL> | reply an image] <language> - Extract text from an image in the specified language (default: English).'
    }
  },
  langs: {
    en: {
      invalidUrl: "⚠️ Invalid image URL, please reply to an image or enter a valid image URL.",
      ocrError: "❌ An error occurred while extracting text:\n%1",
      ocrSuccess: "✅ Text extracted from the image:\n%1"
    }
  },
  async onStart({ message, event, args, getLang }) {
    const imageUrl = event.messageReply?.attachments[0]?.url || args[0];
    if (!imageUrl) {
      return message.reply(getLang('invalidUrl'));
    }
    let language = 'eng';
    if (args[1]) {
      language = args[1];
    }
    try {
      const response = await axios.post('https://api.foxzihel2.repl.co/ocr/extract-text', {
        imageUrl,
        language
      });
      message.reply(getLang('ocrSuccess', response.data.text));
    } catch (error) {
      const err = error.response?.data?.message || error.message;
      message.reply(getLang('ocrError', err));
    }
  }
}