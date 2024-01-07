const axios = require('axios');

module.exports = {
	config: {
		name: "devicesearch",
		aliases: ["devicesearch"],
		version: "1.1",
		author: "razihelX",
		countDown: 5,
		role: 0,
		shortDescription: "get device data",
		longDescription: " ",
		category: "Android",
		guide: "{pn} {{<name>}}"
	},

	onStart: async function ({ message, args }) {
		const name = args.join(" ");
		if (!name)
			return message.reply(`⚠️ | Please enter device name!`);
		else {
			const BASE_URL = `https://api.foxzihel2.repl.co/gsmarena/device/search?q=${encodeURIComponent(name)}`;
			try {
				const { data } = await axios.get(BASE_URL);
				const device = data[0];
				if (!device) {
					return message.reply(`🥺 Not Found`);
				}
				const form = {
					body: `╭「Device Search Desc」`
						+ `\n│_`
						+ `\n❏ ID: ${device.id}`
						+ `\n❏ Name: ${device.name}`
						+ `\n❏ Description: ${device.description}`
						+ `\n╰—————————`
				};
				if (device.img) {
					form.attachment = await global.utils.getStreamFromURL(device.img);
				}
				message.reply(form);
			} catch (e) {
				console.error(e);
				message.reply(`⚠️ | Error: ${e.message}`);
			}
		}
	}
};