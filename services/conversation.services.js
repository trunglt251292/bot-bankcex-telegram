import Conversation from "../model/conversations.model";
import Users from '../model/user.model';
import StringHelper from '../StringHelper';
import Configs from '../config';
import Step from '../model/step.model';
import Social from '../model/post.model';



export async function handleDefaultMesage(msg, conversation) {
  try{
    let telegram_id = msg.from.id;
    let data = {
      message_reply: '',
      buttons: '',
      telegram_id
    };
    let step_user = await Step.findOne({telegram_id});
    if (msg.text.toString().toLowerCase() !== 'cancel') {
      if (conversation.context === 'email') {
        let user = await Users.findOne({telegram_id});
        let mail = msg.text.toString().toLowerCase();
        if (!StringHelper.isValidEmail(mail)) {
          data.message_reply = 'Invalid email!';
        } else {
          step_user.step = 2;
          await step_user.save();
          user.email = mail;
          await user.save();
          data.message_reply = 'Update email done.';
        }
      } else if (conversation.context === 'eth') {
        let user = await Users.findOne({telegram_id});
        let ethAddress = msg.text.toString().toLowerCase();
        if (!StringHelper.isValidETHAddress(ethAddress)) {
          data.message_reply = 'Invalid ETH Address!';
        } else {
          step_user.step = 3;
          await step_user.save();
          user.ethAddress = ethAddress;
          await user.save();
          data.message_reply = 'Update ETH Address done.';
          // Queue.getInstance().pushJob('CHECK_RECEIVE_AIRDROP', {telegram_id});
        }
      } else if (conversation.context === 'facebook'){
        let facebook = await Social.findOne({telegram_id, social: 'facebook'});
        if(!facebook){
          await Social.create({
            telegram_id,
            social: 'facebook',
            link: msg.text.toString().toLowerCase()
          });
        } else {
          facebook.link = msg.text.toString().toLowerCase();
          await facebook.save();
        }
        data.message_reply = 'Update link post facebook done.';
        data.buttons = Configs.buttons_social;
        let count = await Social.count({telegram_id, social:{$in:['facebook', 'telegram', 'twitter']}});
        if(count === 3){
          step_user.step = 4;
          await step_user.save();
        }
      } else if (conversation.context === 'telegram'){
        let telegram = await Social.findOne({telegram_id, social: 'telegram'});
        if(!telegram){
          await Social.create({
            telegram_id,
            social: 'telegram',
            link: msg.text.toString().toLowerCase()
          });
        } else {
          telegram.link = msg.text.toString().toLowerCase();
          await telegram.save();
        }
        data.message_reply = 'Update link post telegram done.';
        data.buttons = Configs.buttons_social;
        let count = await Social.count({telegram_id, social:{$in:['facebook', 'telegram', 'twitter']}});
        if(count === 3){
          step_user.step = 4;
          await step_user.save();
        }
      } else if (conversation.context === 'twitter'){
        let twitter = await Social.findOne({telegram_id, social: 'twitter'});
        if(!twitter){
          await Social.create({
            telegram_id,
            social: 'twitter',
            link: msg.text.toString().toLowerCase()
          });
        } else {
          twitter.link = msg.text.toString().toLowerCase();
          await twitter.save();
        }
        data.message_reply = 'Update link post twitter done.';
        data.buttons = Configs.buttons_social;
        let count = await Social.count({telegram_id, social:{$in:['facebook', 'telegram', 'twitter']}});
        if(count === 3){
          step_user.step = 4;
          await step_user.save();
        }
      } else {
        data.message_reply = "Warning: Invalid Commands";
        data.buttons = Configs.buttons;
      }
    } else {
      conversation.context = 'normal';
      await conversation.save();
      data.message_reply = Configs.HelloMessage;
      data.buttons = Configs.buttons;
    }
    return data;
  }catch (err) {
    console.log('error handleDefaultMesage : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}

export async function getConverstaion(options) {
  try{
    let conversations = await Conversation.findOne({chat_id: options.chat_id});
    if(!conversations){
      // console.log('da vao day');
      conversations = await Conversation.create({
        chat_id: options.chat_id
      })
    }
    return conversations;
  }catch (err) {
    console.log('error getConverstaion : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}

export async function updateContext(options) {
  try{
    await Conversation.update({
      chat_id: options.chat_id
    },{
      $set:{
        context: options.context
      }
    })
  }catch (err) {
    console.log('error getConverstaion : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}
