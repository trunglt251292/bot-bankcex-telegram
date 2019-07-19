import Step from '../model/step.model';

export async function getStepByUser(telegram_id) {
  try{
    let step = await Step.findOne({telegram_id});
    if(!step){
      step = await Step.create({
        telegram_id
      })
    }
    return step;
  }catch (err) {
    return Promise.reject({status:500, success: false, error:'Internal Server Error.'})
  }
}
