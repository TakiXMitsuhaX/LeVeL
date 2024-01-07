module.exports = {
  config: {
    name: 'rainbow',
    aliases: ['rainbow'],
    version: '2.0',
    author: 'razihelX',
    role: 1,
    category: 'utility',
    shortDescription: {
      en: 'change the gc color continously '
    },
    longDescription: {
      en: 'Change the Group-Chat color Continously'
    },
    guide: {
      en: '{pn} <number>'
    }
  },

	onStart: async function ({api,event,args,}) {
  const value = args.join();
  if (isNaN(value)) return api.sendMessage(`It is not a number!`, event.threadID, event.messageID);
  if (value > 30) return api.sendMessage(`Must be less ${'30'}!`, event.threadID, event.messageID);
  const color = ['196241301102133', '169463077092846', '2442142322678320', '234137870477637', '980963458735625', '175615189761153', '2136751179887052', '2058653964378557', '2129984390566328', '174636906462322', '1928399724138152', '417639218648241', '930060997172551', '164535220883264', '370940413392601', '205488546921017', '809305022860427'];
  for (var i = 0; i < value; i++) {
    api.changeThreadColor(color[Math.floor(Math.random() * color.length)], event.threadID)
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return;
}
};