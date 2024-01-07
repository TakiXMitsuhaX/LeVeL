const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
config: {
    name: "mangakakalot",
    aliases: ["mangakakalot"],
    version: "1.0",
    author: "jfhigtfdv",
    countDown: 5,
    role: 0,
    longDescription: {
    vi: "",
    en: "Read Manga on Chat",
    },
    category: "box chat",
    guide: {
    vi: "",
    en: "{pn} <content>",
    },
},
onStart: async function () {},

onChat: async function ({ api, event, commandName }) {
    if (event.body && typeof event.body === 'string' && (event.body.toLowerCase().split(' ')[0] === 'manga' || event.body.toLowerCase().split(' ')[0] === 'manhwa' || event.body.toLowerCase().split(' ')[0] === 'manhua')) {
        return api.sendMessage('Search Manga\n----------------------------------\n(Reply to this message)', event.threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName,
                author: event.senderID,
                messageID: info.messageID,
                type: 'search',
                pagetype: false,
                page: 1,
                searchStatus: true
            });
        }, event.messageID);
    }
},

onReply: async function ({ Reply, api, event, args }) {
    try {
        const { commandName, author, messageID, type } = Reply;
        if (event.senderID != author) return;
        if (type == 'search') {
            let _page = Reply.page;
            if (Reply.pagetype == true) {
                if (args[0].toLowerCase() === 'page' && args[1] > 0) {
                    _page = args[1];
                } else if (args[0].toLowerCase() === 'select' && args[1] > 0) {
                    const itemIndex = args[1] - 1;
                    const selectedItem = Reply.currentPageData[itemIndex];
                    if (selectedItem) {
                        api.setMessageReaction("â³", event.messageID, () => {}, true);
                        const getInfo = await axios.get(`https://zero-api.saludeskimdev.repl.co/manga/mangakakalot/fetchMangaInfo/${selectedItem.ID}`);
                        const mangaInfo = getInfo.data;
                        const _info = `Title: ${mangaInfo.title}\nAltTitles: ${mangaInfo.genres.join(', ')}\n\nDescription: ${mangaInfo.description}\n\nGenres: ${mangaInfo.genres.join(', ')}\nStatus: ${mangaInfo.status}\nAuthors: ${mangaInfo.authors.join(', ')}\nChapters: ${mangaInfo.chapters.length}\n\n(Reply to this message the chapter you want to read. Ex: Read/Latest/Chapter 2/Done)`;
                        const stream = await global.utils.getStreamFromURL(mangaInfo.image);
                        return api.sendMessage({  body: _info, attachment: stream }, event.threadID, (err, info) => {
                            api.setMessageReaction("", event.messageID, () => {}, true);
                            global.GoatBot.onReply.set(info.messageID, {
                                commandName,
                                author: author,
                                messageID: info.messageID,
                                type: 'read',
                                mangaInfo,
                                option: false
                            });
                        }, event.messageID);
                    } else {
                        return api.sendMessage('Invalid item numberâš ï¸', event.threadID, event.messageID);
                    }
                } else if (args[0].toLowerCase() == 'done') {
                    return api.unsendMessage(messageID) && api.setMessageReaction("âœ…", event.messageID, () => {}, true);
                } else {
                    return api.sendMessage('Invalid input!âš ï¸\nEx: Page 2/Select 2/Done', event.threadID, event.messageID);
                }
            }
            let resultString = [];
            let data = resultString;
            if (Reply.searchStatus == true) {
                search = event.body;
                const stringWithoutSymbols = search.replace(/[\/\\:]/g, '');
                api.setMessageReaction("â³", event.messageID, () => {}, true);
                const result = await axios.get(`https://zero-api.saludeskimdev.repl.co/manga/mangakakalot/${stringWithoutSymbols}`);
                const mangaSearch = result.data.results;
                if (!mangaSearch.length) return api.sendMessage('No results found!', event.threadID, () => {api.setMessageReaction("âš ï¸", event.messageID, () => {}, true);},event.messageID);
                mangaSearch.forEach(item => {
                    resultString.push({ID: item.id, image: item.image, description: item.title});
                });
            } else {
                resultString = Reply.resultString;
                data = Reply.resultString;
            }

            const pageSize = 9;
            const totalPages = Math.ceil(data.length / pageSize);
            let _data = '';
            const images = [];
            let currentPageData;

            if (_page < 1 || _page > totalPages) {
                return api.sendMessage(`Page ${_page} does not exist.\nTotal pages: ${totalPages}`, event.threadID, event.messageID);
            } else {
                currentPageData = await paginate(data, _page, pageSize);
                currentPageData.forEach((item, index) => {
                _data += `${index + 1}. ${item.description}\n\n`;
                images.push({img: item.image});
                });
            }

            const imageURLs = images.map(item => item.img);
            const streams = await Promise.all(imageURLs.map(url => global.utils.getStreamFromURL(url)));
            return api.sendMessage({body: `Results:\n----------------------------------\n${_data}Current page ${_page} of ${totalPages} page/s.\n(Reply to this message. Ex: Page 2/Select 2/Done)`, attachment: streams}, event.threadID, (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName,
                author: author,
                messageID: info.messageID,
                resultString,
                type: 'search',
                pagetype: true,
                page: _page,
                searchStatus: false,
                currentPageData
                });
                api.setMessageReaction("", event.messageID, () => {}, true);
                api.unsendMessage(messageID);
            }, event.messageID);
        } else if (type == 'read') {
            let position;
            if (Reply.option == false) {
                if (args[0].toLowerCase() == 'chapter' && args[1] > 0 && Reply.mangaInfo.chapters.length > args[1]-1) {
                    position = args[1] - 1;
                } else if (args[0].toLowerCase() == 'done') {
                    return api.unsendMessage(messageID) && api.setMessageReaction("âœ…", event.messageID, () => {}, true);
                } else if (args[0].toLowerCase() == 'read' && Reply.mangaInfo.chapters.length > 0) {
                    position = 0;
                } else if (args[0].toLowerCase() == 'latest') {
                    position = Reply.mangaInfo.chapters.length - 1;
                } else {
                    return api.sendMessage("Invalid chapter!âš ï¸\nEx: Chapter 2/Read/Latest/Done", event.threadID, event.messageID);
                }
            } else {
                if (args[0].toLowerCase() == 'next' && Reply.mangaInfo.chapters.length > Reply.position + 1) {
                    position = Reply.position + 1;
                } else if (args[0].toLowerCase() == 'prev' && Reply.position > 0) {
                    position = Reply.position - 1;
                } else if (args[0].toLowerCase() === 'chapter' && args[1] > 0 && Reply.mangaInfo.chapters.length > args[1]-1) {
                    position = args[1] - 1;
                } else if (args[0].toLowerCase() == 'done') {
                    return api.unsendMessage(messageID) && api.setMessageReaction("âœ…", event.messageID, () => {}, true);
                } else {
                    return api.sendMessage('No chapter available. Ex: Chapter 2/Next/Prev/Done', event.threadID, event.messageID);
                }
            }
            const _chapterID = Reply.mangaInfo.chapters;
            const chapter = [..._chapterID].reverse();
            const chapterID = chapter[position];
            const modifiedString = chapterID.id.replace(/\$\$READMANGANATO/g, '');

            api.setMessageReaction("â³", event.messageID, async () => {
            try {
                const res = await axios.get(`https://zero-api.saludeskimdev.repl.co/manga/mangakakalot/fetchChapterPages/${modifiedString}`);
                const imageURLs = res.data.pages.map(item => item.url);
                const streams = await Promise.all(imageURLs.map(url => global.utils.getStreamFromURL(url)));
                let _mangaInfo = `Title: ${Reply.mangaInfo.title}\n${chapterID.title}\n(Reply to this message your choices. Example: Next/Prev/Chapter 2/Done)`;
                const batchSize = 30;
                for (let i = 0; i < streams.length; i += batchSize) {
                const batch = streams.slice(i, i + batchSize);
                const message = {
                    body: _mangaInfo,
                    attachment: batch,
                };
                const info = await api.sendMessage(message, event.threadID);
                global.GoatBot.onReply.set(info.messageID, {
                    commandName,
                    author: author,
                    messageID: info.messageID,
                    type: 'read',
                    position,
                    mangaInfo: Reply.mangaInfo,
                    option: true
                });
                _mangaInfo = '';
                }

                await api.setMessageReaction("", event.messageID, () => {}, true);
            } catch (error) {
                return api.sendMessage("Something went wrong", event.threadID, event.messageID) && api.setMessageReaction("âš ï¸", event.messageID, () => {}, true);
            }
            }, true);
        }
    } catch (error) {
        return api.sendMessage(`${error}`, event.threadID, event.messageID) && api.setMessageReaction("âš ï¸", event.messageID, () => {}, true);
    }
}
};

async function paginate(array, page, pageSize) {
const startIndex = (page - 1) * pageSize;
const endIndex = startIndex + pageSize;
return array.slice(startIndex, endIndex);
  }