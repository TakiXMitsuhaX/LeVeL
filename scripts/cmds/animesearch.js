const axios = require('axios');

module.exports = {
  config: {
    name: "animesearch",
    aliases: ["animesearch"],
    version: "1.5",
    author: "razihelX",
    countDown: 5,
    role: 0,
    shortDescription: "Search for anime information",
    longDescription: "Search for anime information and data. ",
    category: "anime",
    guide: {
      en:"{pn} {{anime name}}"
    },
  },

  onStart: async function ({ message, args }) {
    const animeName = args.join(" ");
    if (!animeName) {
      return message.reply(`⚠️ | Please enter an anime name to search!`);
    } else {
      const BASE_URL = `https://api.foxzihel2.repl.co/anime?name=${encodeURIComponent(animeName)}`;
      try {
        const res = await axios.get(BASE_URL);
        const animeData = res.data.data;

        const title = animeData[0].title;
        const title_jp = animeData[0].title_japanese;
        const type = animeData[0].type;
        const episodes = animeData[0].episodes;
        const score = animeData[0].score;
        const synopsis = animeData[0].synopsis;
        const imageUrl = animeData[0].images.jpg.large_image_url;
        const airing = animeData[0].airing;
        const startDate = animeData[0].aired.from.slice(0, 10);
        const endDate = animeData[0].aired.to.slice(0,10);
        const status = animeData[0].status;
        const rating = animeData[0].rating;
        const studio = animeData[0].studios[0].name;
        const favorite = animeData[0].favorites;
        const genre = animeData[0].genres.map
(g => g.name).join(", ");


        const form = {
          body: `==「${title}」==\n ==「${title_jp}」==\n \n📺 Type: ${type}\n✅ Episodes: ${episodes}\n⭐ Score: ${score}\n☁️ Airing: ${airing}\n📅 Start date: ${startDate}\n🗓️ End date: ${endDate}\n📡 Status: ${status}\n👍 Rating: ${rating}\n🎬 Studio: ${studio}\n💖 Favorites: ${favorite}\n🎭 Genre: ${genre}\n\n🔉 Synopsis: ${synopsis}`
        };

        if (imageUrl) {
          form.attachment = await global.utils.getStreamFromURL(imageUrl);
        }

        message.reply(form);
      } catch (e) {
        console.error(e);
        message.reply(`🥺 Sorry, I couldn't find any anime with the name "${animeName}".`);
      }
    }
  }
};
