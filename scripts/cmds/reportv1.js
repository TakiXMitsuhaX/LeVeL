module.exports = {
    config: {
      name: 'reportv1',
      aliases: ['report'],
      version: '1.1',
      author: 'razihelX' ,
      role: 2,
      category: 'hehehe',
      shortDescription: {
        en: 'Sunog Hahhaha'
      },
      longDescription: {
        en: 'Sunog ang account'
      },
      guide: {
        en: '{pn} '
      }
    }, 
    
    onReply: async function({ api, event, Reply, commandName}) {
      const handleReply = Reply;
      if (event.senderID != handleReply.author) return;
      switch (handleReply.Case) {
          case 1: {
              return api.sendMessage("Reply To This Message And Enter The Real Name Of The Facebook Person You Want To Report!", event.threadID,(error, info) => {
                global.GoatBot.onReply.set(info.messageID, { 
                    commandName,
                    Link: event.body,  
                    messageID: info.messageID, 
                    author: event.senderID, 
                    Case: 2 
                })
            });
          }
          case 2: {
              return api.sendMessage("Please Reply To This Message And Enter Your Gmail To Receive Facebook Notifications!", event.threadID,(error, info) => {
                global.GoatBot.onReply.set(info.messageID, { 
                    commandName,
                    Link: handleReply.Link, 
                    RealName: event.body, 
                    messageID: info.messageID, 
                    author: event.senderID, 
                    Case: 3 
                })
            });
          }
          case 3: {
              return api.sendMessage("Please Reply To This Message And Enter What You Want To Report !", event.threadID,(error, info) => {
                global.GoatBot.onReply.set(info.messageID, { 
                    commandName,
                    Link: handleReply.Link,
                    RealName: handleReply.RealName,
                    Gmail: event.body,
                    messageID: info.messageID, 
                    author: event.senderID, 
                    Case: 4 
                })
            });
          }
          case 4: {
              return api.sendMessage("Please Reply To This Message And Enter The Number Of Times You Want To Report To The Victim !", event.threadID,(error, info) => {
                global.GoatBot.onReply.set(info.messageID, { 
                    commandName,
                    Link: handleReply.Link,
                    RealName: handleReply.RealName,
                    Gmail: handleReply.Gmail, 
                    Content: event.body,
                    messageID: info.messageID, 
                    author: event.senderID, 
                    Case: 5 
                })
            });
          }
          case 5: {
              var Time = parseInt(event.body);
              if (isNaN(event.body)) {
                  return api.sendMessage("Please Re-enter the Victim Report Number !", event.threadID,(error, info) => { 
                    global.GoatBot.onReply.set(info.messageID, { 
                        commandName,
                        Link: handleReply.Link,
                        RealName: handleReply.RealName,
                        Gmail: handleReply.Gmail, 
                        Content: handleReply.Gmail, 
                        Time: event.body,
                        messageID: info.messageID, 
                        author: event.senderID, 
                        Case: 5 
                    })
                });
              }
              if (event.body > 100) {
                  return api.sendMessage("Please Enter No More Than 100 Times to Report to Victim!", event.threadID,(error, info) => {
                    global.GoatBot.onReply.set(info.messageID, { 
                        commandName,
                        Link: handleReply.Link,
                        RealName: handleReply.RealName,
                        Gmail: handleReply.Gmail, 
                        Content: handleReply.Content, 
                        Time: event.body,
                        messageID: info.messageID, 
                        author: event.senderID,
                        Case: 5 
                    })
                });
              }
              if (event.body < 1) {
                  return api.sendMessage("Please Enter the Victim Report Number No Less than 1 Time!", event.threadID,(error, info) => {
                    global.GoatBot.onReply.set(info.messageID, { 
                        commandName,
                        Link: handleReply.Link,
                        RealName: handleReply.RealName,
                        Gmail: handleReply.Gmail, 
                        Content: handleReply.Content, 
                        Time: event.body,
                        messageID: info.messageID, 
                        author: event.senderID, 
                        Case: 5 
                    })
                });
              }
              return api.sendMessage("You Requested to Report Victim With The Following Information :\nReal Name  : " + handleReply.RealName + "\nGmail(yours): " + handleReply.Gmail + "\ncontent : " + handleReply.Content + "\nReport number : " +  (handleReply.Time || Time), event.threadID,  (error, info) => {
                api.sendMessage("Please Reply 'ok' To Confirm Rocket Launch💀",event.threadID,(err,info) => {
                global.GoatBot.onReply.set(info.messageID, { 
                    commandName,
                    Link: handleReply.Link,
                    RealName: handleReply.RealName,
                    Gmail: handleReply.Gmail, 
                    Content: handleReply.Content, 
                    Time: event.body,
                    messageID: info.messageID,
                    author: event.senderID, 
                    Case: 6 
                })
            })
            });
          }
          case 6: {
              if (event.body != "ok") return api.sendMessage("Please Reply To This Message And Enter'ok' To Confirm Rocket Launch💀",event.threadID,(error, info) => global.GoatBot.onReply.set({ Link: handleReply.Link,RealName: handleReply.RealName,Gmail: handleReply.Gmail, Content: handleReply.Content, Time: handleReply.Time,name: this.config.name, messageID: info.messageID, author: event.senderID, Case: 6 }));
              for (let i = 0; i < (handleReply.Time || Time); i++) {
                  try {
                      var DataRp = await api.sendMessage('ReportV1',{ Link: handleReply.Link, RealName: handleReply.RealName, Content: handleReply.Content, Gmail: handleReply.Gmail });
                      console.log(i + "/ Report " + DataRp);
                      await new Promise(resolve => setTimeout(resolve, 1 * 1000));
                  }
                  catch (e) {
                      console.log(e);
                      return api.sendMessage("Undefined Error !\n"+e, event.threadID);
                  }
              }
              return api.sendMessage(`sent: ${ (handleReply.Time || Time)}  Report To  victim ${handleReply.RealName} !`,event.threadID);
          }
      }
  }, 
  onStart: async function({ api, event, commandName, Reply }) {
    const handleReply =  Reply;
      return api.sendMessage("Please reply to this message and enter the Facebook link of the person you want to report!", event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, { 
            commandName, 
            messageID: info.messageID, 
            author: event.senderID, 
            Case: 1 
        });
        })
    }
};