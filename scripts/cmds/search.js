const axios = require("axios");

module.exports = {
	config: {
		name: "search", 
		version: "1.1",
		author: "RazihelX", 
		countDown: 5,
		role: 0,
		shortDescription: {
			en:"Perform a Google search"
		}, 
		longDescription: {
			en: "Perform a Google search for a given query",
		}, 
		category: "utility", 
		guide: "{pn} <query>" 
	}, 

	onStart: async function  ({ event, api, args, Users })  {
		if (args.length < 1) {
			api.sendMessage("Please provide a query to search for.", event.threadID, event.messageID);
			return;
		}

		const query = args.join(" ");

		try {
			const response = await axios.get(`https://www.googleapis.com/customsearch/v1?q=${query}&key=AIzaSyB1ymvb0D-KWXobzVIDSJOleJMWrfGbkLE&cx=c5b8108dd2da64b29`);
			const data = response.data;

			let message = `Search results for "${query}":\n\n`;
			
			if (data.items && data.items.length > 0) {
				data.items.forEach((item, index) => {
					message += `${index + 1}. ${item.title}\n${item.snippet}\n${item.link}\n\n`;
				});
			} else {
				message += "No results found.";
			}

			api.sendMessage(message, event.threadID, event.messageID);
		} catch (error) {
			api.sendMessage(`Error performing search for "${query}". Please make sure you have provided a valid query and have set up your Google requirements.`, event.threadID, event.messageID);
		}
	}
};