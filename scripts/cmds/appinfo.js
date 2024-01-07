const axios = require('axios');

module.exports = {
  config: {
    name: 'appinfo',
    aliases: ['appinfo'],
    version: '1.1',
    author: 'razihelX',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: '📱 Displays details of the app from playstore.'
    },
    longDescription: {
      en: '📱 Display the details and info of the app from PlayStore. Usage: !appinfo <app_id>'
    },
    guide: {
      en: '📱 {pn} <app_id> / com.google.android.apps.translate'
    }
  },
  onStart: async function ({ api, event, args, message }) {
    const appId = args[0];

    if (!appId) {
      api.sendMessage({
        body: '❗️ Please specify an app ID.'
      }, event.threadID, event.messageID);
      return;
    }

    const response = await axios.get('https://api.foxzihel2.repl.co/gscraper', {
      params: {
        appId: appId
      }
    });

    const app = response.data;

    if (!app) {
      api.sendMessage({
        body: `❗️ Could not find app with ID ${appId}.`
      }, event.threadID, event.messageID);
      return;
    }

    let headerImg = app.headerImage;
    let icon = app.icon;
    let title = app.title;
    let summary = app.summary;
    let installs = app.installs;
    let minInstalls = app.minInstalls;
    let maxInstalls = app.maxInstalls;
    let score = app.score;
    let scoreText = app.scoreText
    let ratings = app.ratings;
    let reviews = app.reviews;
    let price = app.price;
    let free = app.free;
    let currency = app.currency;
    let priceText = app.priceText;
    let available = app.available;
    let offersIAP = app.offersIAP;
    let androidVersion = app.androidVersion;
    let androidVersionText = app.androidVersionText;
    let developer = app.developer;
    let developerId = app.developerId;
    let developerEmail = app.developerEmail;
    let developerWebsite = app.developerWebsite;
    let developerAddress = app.developerAddress;
    let privacyPolicyhttp = app.privacyPolicyhttp; 
    let developerInternalID = app.developerInternalID;
    let genre = app.genre;
    let genreId = app.genreId;
  
    // Get the streams of the screenshot and icon images
    const streams = await Promise.all([headerImg,icon].map((image) => global.utils.getStreamFromURL(image)));

    api.sendMessage({
      body: `📱 Tittle: ${title}        
📝 Summary: ${summary}
📥 Installs: ${installs}
🔽 MinInstalls: ${minInstalls} 
🔼 MaxInstalls: ${maxInstalls}
🌟 Score: ${score} 
⭐️ ScoreText: ${scoreText} 
👍 Ratings: ${ratings} 
💬 Reviews: ${reviews} 
💰 Price: ${price} 
💵 Free: ${free} 
💳 Currency: ${currency} 
💲 PriceText: ${priceText}
🔍 Available: ${available} 
💰 OffersIAP: ${offersIAP}
📱 AndroidVersion: ${androidVersion} 
🔤 AndroidVersionText: ${androidVersionText}
👨‍💼 Developer: ${developer}
🆔 DeveloperId: ${developerId}
📧 DeveloperEmail: ${developerEmail}
🌐 DeveloperWebsite: ${developerWebsite}
🏠 DeveloperAddress: ${developerAddress}
🔒 PrivacyPolicy: ${privacyPolicyhttp}
🔑 DeveloperInternalID: ${developerInternalID}
🎮 Genre: ${genre}
🆔 GenreId: ${genreId}`, 
attachment: streams
    }, event.threadID, event.messageID);
  }
};