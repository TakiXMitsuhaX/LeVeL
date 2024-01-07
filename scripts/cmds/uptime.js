const axios = require('axios');
const { performance } = require('perf_hooks');

const monitoringData = {};

module.exports = {
  config: {
    name: "uptime",
    author: "Razihel",
    role: 3,
    shortDescription: " ",
    longDescription: "",
    category: "utilities",
    guide: "{pn}"
  },

  startMonitoring: function (api, url, threadID, eventID) {
    const monitoringInterval = 5 * 60 * 1000;
    const monitoringTimeout = 24 * 60 * 60 * 1000;

    const startTimestamp = performance.now();
    let lastNotificationTimestamp = startTimestamp;

    const monitorURL = async () => {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const endTimestamp = performance.now();
          const uptimeInSeconds = (endTimestamp - startTimestamp) / 1000;
          api.sendMessage(`🆕 The URL ${url} is up and running. Uptime: ${uptimeInSeconds.toFixed(2)} seconds.`, threadID, eventID);
          lastNotificationTimestamp = endTimestamp;
          console.log(`\x1b[32m[${new Date().toISOString()}] URL ${url} is up.\x1b[0m`);
        }
      } catch (error) {
        const currentTimestamp = performance.now();
        const downtimeInSeconds = (currentTimestamp - lastNotificationTimestamp) / 1000;
        api.sendMessage(`⏬ The URL ${url} is currently down. Downtime: ${downtimeInSeconds.toFixed(2)} seconds.`, threadID, eventID);
        lastNotificationTimestamp = currentTimestamp;
        console.log(`\x1b[32m[${new Date().toISOString()}] URL ${url} is down.\x1b[0m`);
      }
    };

    const monitoringIntervalId = setInterval(monitorURL, monitoringInterval);

    setTimeout(() => {
      clearInterval(monitoringIntervalId);
      api.sendMessage(`🚫 Monitoring of ${url} has been stopped.`, threadID, eventID);
      console.log(`\x1b[32m[${new Date().toISOString()}] Monitoring of ${url} has been stopped.\x1b[0m`);

      setTimeout(() => {
        module.exports.startMonitoring(api, url, threadID, eventID);
      }, monitoringTimeout);
    }, monitoringTimeout);

    api.sendMessage(`🆙 Monitoring ${url} for uptime.`, threadID, eventID);
    console.log(`\x1b[32m[${new Date().toISOString()}] Started monitoring ${url}.\x1b[0m`);

    monitoringData[url] = {
      intervalId: monitoringIntervalId,
      startTimestamp: startTimestamp,
    };
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const url = args[0];

    if (!url) {
      api.sendMessage('🆕 |Please provide a URL to monitor.', threadID, messageID);
      return;
    }

    if (!url.startsWith('https://')) {
      api.sendMessage('❎ Invalid URL. Please make sure the URL starts with "https://".', threadID, messageID);
      return;
    }

    if (monitoringData[url]) {
      api.sendMessage(`🆙 Monitoring of ${url} is already active.`, threadID, messageID);
      return;
    }

    module.exports.startMonitoring(api, url, threadID, messageID);
    console.log(`\x1b[32m[${new Date().toISOString()}] Monitoring ${url} for uptime.\x1b[0m`);
  },

  startAllMonitoring: function (api, threadID, messageID) {
    for (const url in monitoringData) {
      if (monitoringData.hasOwnProperty(url)) {
        module.exports.startMonitoring(api, url, threadID, messageID);
      }
    }
  },
};
