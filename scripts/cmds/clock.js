const moment = require('moment-timezone');

module.exports = {
  config: {
    name: 'worldclock',
    aliases: ['worldclock'],
    version: '1.0.0',
    author: 'Example Author',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Get the current time in a given time zone'
    },
    longDescription: {
      en: 'Get the current time in a given time zone'
    },
    guide: {
      en: '{pn} <timezone>'
    }
  },
  onStart: async function ({ api, event, args }) {
    // Get the timezone from the command arguments
    const timezone = args[0];

    // Use moment-timezone to retrieve the current time in the given timezone
    const currentTime = moment().tz(timezone).format('hh:mm:ss A');

    // Send the current time to the user
    api.sendMessage(`The current time in ${timezone} is ${currentTime}`, event.threadID, event.messageID);
  },
};