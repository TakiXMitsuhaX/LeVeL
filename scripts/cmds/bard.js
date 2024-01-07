
const fs = require("fs-extra");
const axios = require("axios");

function boldifyWord(word) {
  let onStartPrompt = "";
  let boldCharacters = {
    a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷',
    k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', 
    u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇', A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', 
    E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', 
    O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', 
    Y: '𝗬', Z: '𝗭', ' ': ' ',
  };

  const boldifiedWord = word
    .split('')
    .map(char => (boldCharacters[char] ? boldCharacters[char] : char))
    .join('');

  return boldifiedWord;
}

function formatBoldContent(content) {
  return content
    .replace(/\*/g, '❏')
    .replace(/❏❏(.*?)❏❏/g, (_, word) => boldifyWord(word))
    .replace(/❏❏: /g, '**: ')
    .replace(/❏\s*❏❏/g, '❏❏')
    .replace(/❏❏\s*❏/g, '❏❏');
}

module.exports = {
  config: {
    name: "bard",
    version: "2.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    longDescription: { en: "Artificial Intelligence Google Bard" },
    guide: { en: "{pn} <query>" },
    category: "ai",
  },

  clearHistory: function () {
    global.GoatBot.onReply.clear();
  },

  onStart: async function ({ message, event, args, commandName }) {
    const prompt = args.join(" ");
    onStartPrompt = prompt;

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      this.clearHistory();
      message.reply("Conversation history cleared.");
      return;
    }

    if (event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo") {
      message.reply("Sorry, I can't help with images yet.");
      return;
    }
    await message.reply("🔍 Providing the answer please wait... ");

    let apiUrl = `https://bard.api-tu33rtle.repl.co/api/bard?ask=${encodeURIComponent(prompt)}`;

    if (event.type === "message_reply") {
      const imageUrl = event.messageReply.attachments[0]?.url;
      if (imageUrl) {
        apiUrl += `&img=${encodeURIComponent(imageUrl)}`;
      }
    }

    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      let content = result.message;
      let imageUrls = result.imageUrls;

      content = formatBoldContent(content);

      const cleanedContent = content.replace(/❏\s*❏❏/g, '❏❏').replace(/❏❏\s*❏/g, '❏❏');
      let replyOptions = {
        body: cleanedContent,
      };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        if (!fs.existsSync(`${__dirname}/cache`)) {
          fs.mkdirSync(`${__dirname}/cache`);
        }

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = `${__dirname}/cache/image` + (i + 1) + ".png";

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
          }
        }

        replyOptions.attachment = imageStreams;
      }

      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    const prompt = onStartPrompt + args.join(" ");
    let { commandName, messageID } = Reply;

    try {
      const apiUrl = `https://bard.api-tu33rtle.repl.co/api/bard?ask=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      let content = response.data.message;
      content = formatBoldContent(content);

      let replyOptions = {
        body: content,
      };

      const imageUrls = response.data.imageUrls;
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        if (!fs.existsSync(`${__dirname}/cache`)) {
          fs.mkdirSync(`${__dirname}/cache`);
        }
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = `${__dirname}/cache/image` + (i + 1) + ".png";

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
          }
        }

        replyOptions.attachment = imageStreams;
      }

      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.delete(messageID);
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      console.error("Error:", error.message);
      message.reply("An error occurred.");
    }
  },
};