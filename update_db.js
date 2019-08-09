import User from './model/user.model';
import Step from './model/step.model';
import Post from './model/post.model';
import Conversations from './model/conversations.model';

export async function migrate() {
  try{
    let users = await User.find({});
    let promise_use = users.map(async e =>{
      if(e.telegram_id){
        e.telegram_id = parseInt(e.telegram_id);
        await e.save();
      }
    });
    let steps = await Step.find({});
    let promise_step = steps.map(async e =>{
      if(e.telegram_id){
        e.telegram_id = parseInt(e.telegram_id);
        await e.save();
      }
    });
    let post = await Post.find({});
    let promis_post = await post.map(async e=>{
      e.telegram_id = parseInt(e.telegram_id);
      await e.save();
    });
    let convers = await Conversations.find({});
    let promis_convers = await convers.map(async e=>{
      e.chat_id = parseInt(e.chat_id);
      await e.save();
    });
    await Promise.all(promise_use);
    await Promise.all(promise_step);
    await Promise.all(promis_post);
    await Promise.all(promis_convers);
  }catch (err) {
    console.log('error migrate : ', err);
  }
}
