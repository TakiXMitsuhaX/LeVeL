const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bard2",
    //aliases: ["heygoogle", "ai", "bard"],
    version: "1.0",
    author: "SiAM | @Siam.The.Fox",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate AI response Bard\n support image reply",
    },
    longDescription: {
      en: "Generate AI response Bard\n support image reply",
    },
    category: "AI",
    guide: {
      en: "{pn} 'prompt'\n\nif you reply with an image then that image will be an attachment in bard question",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    const prompt = args.join(" ");
    if (!prompt) {
      message.reply("Please provide a prompt. Usage: /bard 'prompt'");
      return;
    }
    const cookie = ''; //if you don't know know how to get cookie from cookies editor then just don't add the cookie parameter with api params ( it will use my default cookie ) . but i recommend  add your own cookies for less error. 

    const key = ''; // Add your  API key here ( get it from SiAM)

  

    let params = {
      prompt: encodeURIComponent(prompt),
      cookie: cookie,//if you add cookies don't encode the cookie. Exact same as cookies editor " __Secure-1PSID " value .
      apiKey: key,
      attImage: "", 
    };

    if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
      params.attImage = encodeURIComponent(event.messageReply.attachments[0].url); // Encode artImage ( its needed or Facebook link will gib error )
    }

    try {
      const response = await axios.get("https://api.siambardproject.repl.co/getBard", { params: params });
      const result = response.data;

      let content = result.answer;
      let attachment = [];

      if (result.attachment && result.attachment.length > 0) {
        const noSpam = result.attachment.slice(0, 6); // it will prevent spam , now matter how many images users ask this will send only first 6 image. 

        for (let url of noSpam) {
          try {
            const stream = await getStreamFromURL(url);
            if (stream) {
              attachment.push(stream);
            }
          } catch (error) {
            console.error(`error: ${url}`);
          }
        }
      }

      await message.reply({
        body: content,
        attachment: attachment,
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("error...");
    }
  },
};