import TelegramBot from 'node-telegram-bot-api';
import Config from "../config";
import {Q} from "../Queue";
import User from '../model/user.model';

export default class Bot {
  constructor() {
    this.bot = new TelegramBot(Config.botToken,{polling: true});

    this.bot.onText(/\/start/, async (msg) => {
      try{
        let count_airdrop = await User.count({});
        // if(count_airdrop < Config.airdrop_limit){
        let inviteCode = msg.text.split(' ')[1];
        if (inviteCode){
          let checkuser = await User.findOne({telegram_id: inviteCode});
          if (checkuser && parseInt(inviteCode) !== checkuser.telegram_id){
            let userUseCode = await User.findOne({telegram_id: msg.from.id});
            if(!userUseCode){
              await User.create({
                telegram_id: msg.from.id,
                invited_by: inviteCode
              });
              if(checkuser.ref_count < 3){
                checkuser.balance += Config.ref_bonus;
                checkuser.ref_count = await User.count({invited_by: inviteCode});
                await checkuser.save();
              }
            }
          }
        }
        this.bot.sendPhoto(msg.chat.id, 'https://storage.googleapis.com/skull/image/banner.jpg');
        this.bot.sendMessage(msg.chat.id,Config.HelloMessage, Config.buttons);
        // } else {
        //   this.bot.sendPhoto(msg.chat.id, 'https://storage.googleapis.com/skull/image/banner.jpg')
        //   this.bot.sendMessage(msg.chat.id,"PO8 Token Airdrop have finished.");
        // }
      }catch (e) {
        this.bot.sendMessage(msg.chat.id,'Error connect server.');
      }
    });

    this.bot.on('message', async (msg) => {
      // let from = Number(msg.from.id).valueOf();
      // let node = from % 3;
      Q.create('ON_MSG', msg).removeOnComplete(true).save();
      // console.log('push for node', node);
      // let kue = Queue.getInstance().getQueue(node);
      // console.log('kue:', kue);
      // let job = await Queue.getInstance().pushJob(node, 'ON_MSG', {msg});
      // console.log('job:', job);
    });
  }

  sendMessage(id, data){
    if(data.buttons){
      this.bot.sendMessage(id, data.message, data.buttons);
    } else {
      this.bot.sendMessage(id, data.message);
    }
  }
  getMember(chatid, userid){
    return this.bot.getChatMember(chatid, userid);
  }
}
