import User from '../model/user.model';
import Step from '../model/step.model';
import Configs from '../config';

export async function checkUser(options) {
  try{
    let check = await User.findOne({telegram_id: options.telegram_id}).lean();
    if(!check){
      check = await User.create(options);
    }
    return check;
  }catch (err) {
    console.log('error checkUser : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}

export async function updateInfo(options) {
  try{
    let user = await User.findOne({telegram_id: options.telegram_id}).lean();

  }catch (err) {
    console.log('error checkUser : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}

export async function getBalanceByUser(options) {
  try{
    let check = await User.findOne({telegram_id: options});
    if(!check){
      check = await User.create({
        telegram_id: options
      });
    }
    return check.balance;
  }catch (err) {
    console.log('error User_Services : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}

export async function claimPO8(options) {
  try{
    let data = {
      message_reply: Configs.HelloMessage,
      buttons: Configs.buttons,
      telegram_id: options
    };
    let check = await User.findOne({telegram_id: options});
    if(!check){
      check = await User.create({
        telegram_id: options
      });
    }
    let step = await Step.findOne({telegram_id: options});
    if(!step){
      step = await Step.create({
        telegram_id: options
      })
    }
    if(step.step < 3){
       data.message_reply = 'You are not eligible. Please follow the order of steps. Thank You.';
    } else if (check.claim) {
      data.message_reply = 'You have claimed.';
    } else {
       data.message_reply = 'Claim PO8 successfully.';
       check.balance += 1700;
       check.ref_count = 3;
       check.claim = true;
       await check.save();
    }
    return data;
  }catch (err) {
    console.log('error claimPO8 : ',err);
    return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
  }
}
//
// export async function checkUser(options) {
//   try{
//
//   }catch (err) {
//     console.log('error checkUser : ',err);
//     return Promise.reject({success: false, status: 500, error:'Internal Server Error.'})
//   }
// }

