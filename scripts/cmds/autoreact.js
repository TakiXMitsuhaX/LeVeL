const AutoReact = {
  config: {
    name: "autoreact",
    version: "1.0",
    author: "razihelX",
    countDown: 5,
    role: 0,
    shortdescription: {
       en: "React to any message"
     },
      longdescription: {
        en:"react to any messages."
    },
    category: "Fun",
  },

  onStart() {},

  async onChat({ event, api }) {
    const message = event.body.toLowerCase();
    let reaction = " ";

    if (message.includes("")) {
      reaction = "💗, 💙, 😇, 🤣" ;
    }

    await api.setMessageReaction(reaction, event.messageID, event.threadID);
  },
};

module.exports = AutoReact;