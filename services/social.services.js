import Social from '../model/post.model';

export async function checkSocial(options) {
  try{
    let check = await Social.findOne({telegram_id: options.telegram_id, social: options.social}).lean();
    if(check){
      return check;
    } else {
      return null;
    }
  }catch (err) {
    return null;
  }
}
