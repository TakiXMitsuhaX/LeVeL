module.exports = {
  config: {
    name: 'ai4',
    aliases: ['ai4'],
    version: '1.1',
    author: 'razihelX' ,
    role: 0,
    category: 'Academics',
    shortDescription: {
      en: 'Gpt 4 receive response '
    },
    longDescription: {
      en: 'Receive a response from Chat Gpt4'
    },
    guide: {
      en: '{pn} <query>'
    }
  },

onStart: async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID, senderID, body } = event;
    let tid = threadID,
    mid = messageID;
    const q = encodeURIComponent(args.join(" "));
    if (!q) return api.sendMessage("[❗] - Missing input", tid, mid);
    try {
        api.setMessageReaction("🔍", mid, (err) => {}, true);

api.sendMessage("🔍 Searching for the answer please wait...", tid, mid);
        const url = 'https://useblackbox.io/chat-request-v4';

  const data = {
    textInput: q,
    allMessages: [{ user: q }],
    stream: '',
    clickedContinue: false,
  };

const res = await axios.post(url, data);

    const m = res.data.response[0][0];
return api.sendMessage(m, tid, mid)
   } catch(e){
  return api.sendMessage(e.message, tid, mid)
    }
}
};