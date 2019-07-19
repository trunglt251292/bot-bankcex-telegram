import {Q} from '../Queue';
import * as User_Services from '../services/user.services';
import {getStepByUser} from "../services/step.services";
import Bot from "../Bot-telegram";
import {handleDefaultMesage, getConverstaion} from "../services/conversation.services";
import {checkSocial} from "../services/social.services";
import Configs from '../config';

const Bot_Telegram = new Bot();
const Button_Cancel = {
  "reply_markup": {
    "keyboard": [["Cancel"]]
  }
};

const Social = `- Facebook PO8: ${Configs.link_facebook_po8} \n` +
  `- Telegram PO8 : ${Configs.link_telegram_po8} \n` +
  `- Twitter PO8 : ${Configs.link_twitter_po8} \n` +
  `- FaceBook SKULLY : ${Configs.link_facebook_skully} \n` +
  `- Telegram SKULLY : ${Configs.link_telegram_skully} \n` +
  `- Twitter SKULLY : ${Configs.link_twitter_skully} \n` +
  `Thanks you.` +
  `\n`;

Q.process("ON_MSG", 5, async (job, done) => {
  try {
    let msg = job.data;
    let telegram_id = msg.from.id;
    // console.log("data: ",msg);
    // Bot_Telegram.sendMessage(msg.from.id, {message:'Hello.'});
    // let end = await checkEnd();
    // // console.log('end:', end);
    // if(end) {
    //   await reply(msg.chat.id, 'The airdrop is end.');
    //   return done(null);
    //   // return Queue.getInstance().pushJob('REPLY', {
    //   //   chatId: msg.chat.id,
    //   //   message: 'The airdrop is end.'
    //   // });
    // }
    //
    // // console.log('msg:', msg);
    let chat_id = msg.chat.id;
    let conversation = await getConverstaion({chat_id});
    let user = await User_Services.checkUser({telegram_id});
    let step = await getStepByUser(telegram_id);
    switch (msg.text) {
      case '1. Follow':
        conversation.context = 'normal';
        await conversation.save();
        if(step.step < 1){
          step.step = 1;
          await step.save();
        }
        Bot_Telegram.sendMessage(telegram_id, {message: `Please follow social US : \n` + `${Social}`});
        break;
      case '2. Email':
        if(step.step < 1){
          Bot_Telegram.sendMessage(telegram_id, {message: 'Warning: Please follow the order of steps'});
        } else {
          conversation.context = 'email';
          await conversation.save();
          if(user.email){
            let message = `Your currently email is ${user.email}. To change your email, enter your new email.`;
            Bot_Telegram.sendMessage(telegram_id, {message, buttons: Button_Cancel});
          } else {
            Bot_Telegram.sendMessage(telegram_id, {message: 'Please enter your email address:', buttons: Button_Cancel});
          }
        }
        break;
      case '3. ETH Address':
        if(step.step < 2){
          Bot_Telegram.sendMessage(telegram_id, {message: 'Warning: Please follow the order of steps'});
        } else {
          conversation.context = 'eth';
          await conversation.save();
          if(user.ethAddress){
            let message = `Your currently ETH address is ${user.ethAddress}. To change your ETH address, enter your new ETH address.`;
            Bot_Telegram.sendMessage(telegram_id, {message, buttons: Button_Cancel});
          } else {
            Bot_Telegram.sendMessage(telegram_id, {message: 'Please enter your ETH address:', buttons: Button_Cancel});
          }
        }
        break;
      case 'Referral':
        let message_link = "Your referral link:\n" +
          "http://telegram.me/"+Configs.botUsername+"?start=" + msg.from.id + "\n" + "You will receive 300/Ref PO8. Maximum 3 person.";
        Bot_Telegram.sendMessage(telegram_id, {message: message_link, buttons: Configs.buttons});
        break;
      case 'Create post in social':
        if(step.step < 3){
          Bot_Telegram.sendMessage(telegram_id, {message: 'Warning: Please follow the order of steps'});
        } else {
          let message_social = "Share post in socical :\n" +
            "Content Post: ";
          Bot_Telegram.sendMessage(telegram_id, {message: message_social, buttons: Configs.buttons_social});
        }
        break;
      case 'Balance':
        let balance = await User_Services.getBalanceByUser(telegram_id);
        Bot_Telegram.sendMessage(telegram_id, {message: `Total balance of you : ${balance}`, buttons: Configs.buttons});
        break;
      case '4. Claim 8$ (800 PO8)':
        let data_claim  = await User_Services.claimPO8(telegram_id);
        Bot_Telegram.sendMessage(data_claim.telegram_id, {message: data_claim.message_reply, buttons: data_claim.buttons});
        break;
      case "1. Facebook":
        conversation.context = 'facebook';
        await conversation.save();
        let facebook = await checkSocial({
          telegram_id,
          social: 'facebook'
        });
        if (facebook){
          let message = `Your currently link post facebook is ${facebook.link}. To change your link post, enter your new link post.`;
          Bot_Telegram.sendMessage(telegram_id, {message, buttons: Button_Cancel});
        } else {
          Bot_Telegram.sendMessage(telegram_id, {message: 'Please enter your list post facebook:', buttons: Button_Cancel})
        }
        break;
      case "3. Join Group Telegram":
        let member = await Bot_Telegram.getMember('@po8_airdrop_bot', telegram_id);
        console.log(member);
        // conversation.context = 'telegram';
        // await conversation.save();
        // let telegram = await checkSocial({
        //   telegram_id,
        //   social: 'telegram'
        // });
        // if (telegram){
        //   let message = `Your currently link post telegram is ${telegram.link}. To change your link post, enter your new link post.`;
        //   Bot_Telegram.sendMessage(telegram_id, {message, buttons: Button_Cancel});
        // } else {
        //   Bot_Telegram.sendMessage(telegram_id, {message: 'Please enter your list post telegram:', buttons: Button_Cancel})
        // }
        break;
      case "2. Twitter":
        conversation.context = 'twitter';
        await conversation.save();
        let twitter = await checkSocial({
          telegram_id,
          social: 'twitter'
        });
        if (twitter){
          let message = `Your currently link post twitter is ${twitter.link}. To change your link post, enter your new link post.`;
          Bot_Telegram.sendMessage(telegram_id, {message, buttons: Button_Cancel});
        } else {
          Bot_Telegram.sendMessage(telegram_id, {message: 'Please enter your list post twitter:', buttons: Button_Cancel})
        }
        break;
      case 'Cancel':
        conversation.context = 'normal';
        await conversation.save();
        Bot_Telegram.sendMessage(telegram_id, {message: Configs.HelloMessage, buttons: Configs.buttons});
        break;
      case "Join Telegram PO8":
        Bot_Telegram.sendMessage(telegram_id, {message: Configs.FollowChannel, buttons: Configs.buttons});
        break;
      default:
        if(!msg.text.includes('start')){
          let data_default = await handleDefaultMesage(msg, conversation);
          Bot_Telegram.sendMessage(data_default.telegram_id, {message: data_default.message_reply, buttons: data_default.buttons});
        }
        break;
    }

    return done(null);
  } catch (err) {
    console.log('err on job ON_MSG:', err);
    return done(err);
  }
});



Q.process('email', 5, async (job, done)=>{
  try {
    let msg = job.data;
    let telegtam_id = msg.from.id;
    // let user = await User_Services.checkUser({telegtam_id});
    Bot_Telegram.sendMessage(telegtam_id, {message: 'Update Email Success.'});
    return done(null);
  } catch (err) {
    console.log('err on job ON_START:', err);
    return done(err);
  }
});

Q.process('eth', 5, async (job, done)=>{
  try {
    let msg = job.data.msg;
    let telegtam_id = msg.from.id;
    let user = await User_Services.checkUser({telegtam_id});
    if(!user) {

    }
    return done(null);
  } catch (err) {
    console.log('err on job ON_START:', err);
    return done(err);
  }
});

Q.process('facebook', 5, async (job, done)=>{
  try {
    let msg = job.data.msg;
    let telegtam_id = msg.from.id;
    let user = await User_Services.checkUser({telegtam_id});
    if(!user) {

    }
    return done(null);
  } catch (err) {
    console.log('err on job ON_START:', err);
    return done(err);
  }
});

Q.process('telegram', 5, async (job, done)=>{
  try {
    let msg = job.data.msg;
    let telegtam_id = msg.from.id;
    let user = await User_Services.checkUser({telegtam_id});
    if(!user) {

    }
    return done(null);
  } catch (err) {
    console.log('err on job ON_START:', err);
    return done(err);
  }
});

Q.process('twitter', 5, async (job, done)=>{
  try {
    let msg = job.data.msg;
    let telegtam_id = msg.from.id;
    let user = await User_Services.checkUser({telegtam_id});
    if(!user) {

    }
    return done(null);
  } catch (err) {
    console.log('err on job ON_START:', err);
    return done(err);
  }
});
