const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: 'rbg',
    aliases: ['rbg'],
    version: '2.0.1',
    author: 'razihX',
    role: 0,
    category: 'AI',
    shortDescription: {
      en: 'Removes the background from any image'
    },
    longDescription: {
      en: 'It uses advanced artificial intelligence to detect and remove the background from photos in seconds.'
    },
    guide: {
			en: "   {pn} [<image url> | reply an image] default(transparent),  bg-color <color name> or <color code> ex: blue | #0000FF, image-bg <image url>"
		}
	},
	langs: {
		en: {
			invalidUrl: "⚠️ Invalid image url, please reply an image or enter an image url",
      syntaxError: "❌ Syntax Error!", 
			error: "❌ An error occurred:\n%1"
      
		}
	},
	onStart: async function ({ message, event, args, getLang }) {
			let imageUrlInPut;
		  let bgcolor;
      let bgimage;
		if (["photo", "sticker"].includes(event.messageReply?.attachments[0]?.type)) {
			imageUrlInPut = event.messageReply.attachments[0].url;
      const param = args[0];
      if(param){
        switch(args[0]) {
          case "bg-color":
          if(!args[1]) {
               return message.reply(getLang("syntaxError"));
          }
            else {
              bgcolor = args[1];
            }
          break;
          case "image-bg":
             if(!args[1]) {
               return message.reply(getLang("syntaxError"));
          }
              else  if (args[1]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g))             {
                  bgimage = args[1];
               }
              else {
                  bgimage = args[1]+".jpg";        
            }
            break;
          default: 
            return message.reply(getLang("syntaxError"));
        }
         }
      }
    else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
			imageUrlInPut = args[0];
      const param = args[1];
      if(param){
        switch(args[1]) {
          case "bg-color":
          if(!args[2]) {
               return message.reply(getLang("syntaxError"));
          }
            else {
              bgcolor = args[2];
            }
          break;
          case "image-bg":
             if(!args[2]) {
               return message.reply(getLang("syntaxError"));
          }
              else  if (args[2]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g))             {
                  bgimage = args[2];
               }
              else {
                 bgimage = args[2]+".jpg";     
            }
            break;
                default: 
            return message.reply(getLang("syntaxError"));
        }
         }
         
		}
		else {
				imageUrlInPut = args[0]+".jpg";
      const param = args[1];
      if(param){
        switch(args[1]) {
          case "bg-color":
          if(!args[2]) {
               return message.reply(getLang("syntaxError"));
          }
            else {
              bgcolor = args[2];
            }
          break;
          case "image-bg":
             if(!args[2]) {
               return message.reply(getLang("syntaxError"));
          }
              else  if (args[2]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g))             {
                  bgimage = args[2];
               }
              else {
                 bgimage = args[2]+".jpg";     
            }
            break;
                default: 
            return message.reply(getLang("syntaxError"));
        }
         }
		}
	 try {
  let response = await 
    axios.post(`https://api.remove.bg/v1.0/removebg`, {
        image_url: imageUrlInPut,
        size: 'auto',
        bg_color: bgcolor,
        bg_image_url: bgimage,
      }, {
      headers: {
       
       'X-Api-Key': 'QhGPFAekafYgb1jPHphHUgzi',   
      },
       responseType: 'arraybuffer',
       encoding: null
     
    });
      console.log(response);
    	const pathSaveImg = `${__dirname}/tmp/no-bg.png`;
		fs.writeFileSync(pathSaveImg, Buffer.from(response.data));
    
	    message.reply({
			attachment: fs.createReadStream(pathSaveImg)
		}, () => fs.unlinkSync(pathSaveImg));
    }
		catch (error) {
			const err = error.response.data.message;
			message.reply(getLang("error", err));
		} 
  }
};