import User from '../model/user.model';
import TelegramBot from "node-telegram-bot-api";
import StringHelper from "../StringHelper";
import Config from '../config';
import Step from '../model/step.model';
import {Q} from "../Queue";
export const bot = new TelegramBot(Config.botToken_memo,{polling: true});


bot.on('message', async (msg)=>{
  try{
    if(msg.text){
      let split = msg.text.split(' ');
      if(split[0].toLowerCase() === '/po8_address_dobi' && msg.chat.id.toString() === Config.group_po8){
        console.log(msg);
        let text = split[1];
        if (StringHelper.isValidETHAddress(text)) {
          Q.create('ON_MSG_MEMO', {msg, text}).removeOnComplete(true).save();
        }
      }
    }
  }catch (err) {
    console.log('Bot memo on message error : ', err);
  }
});

Q.process('ON_MSG_MEMO', 5, async (job, done)=>{
  try{
    let data = job.data;
    let msg = data.msg;
    let address = data.text;
    let user = await User.findOne({telegram_id: msg.from.id});
    if(user){
      user.ethAddress = address;
      await user.save();
    } else {
      await User.create({
        telegram_id: msg.from.id,
        firstName: msg.from.first_name,
        lastName: msg.from.last_name,
        claim: true,
        ethAddress : address,
        balance: 1700,
        ref_count: 3
      });
    }
    await Step.update({
      telegram_id: msg.from.id
    },{
      $set:{
        step: 3
      }
    },{
      upsert: true
    });
    bot.sendMessage(msg.chat.id, `Done! Congratulations "${msg.from.first_name} ${msg.from.last_name}" have updated PO8 Deposit Address on DOBI Exchange successfully.`);
  }catch (err) {
    console.log('err on job ON_MSG_MEMO:', err);
    return done(err);
  }
});
