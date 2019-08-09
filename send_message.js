import {bot} from "./worker/bot_memo.worker";
import Config from './config';

export async function sendMessage() {
  try{
    let msg = `\u{1F525}\u{1F525} PO8 will list on DOBI Exchange on 25th of July \u{1F525}\u{1F525} \n\n
Hello guys \n
Thank you for joining the PO8 Token Airdrop! \u{1F525} \n
\u{2705} PO8 is giving out $1,000,000 in PO8 tokens. \u{2705} \n
\u{2705} Here is your chance to earn up to 1,700 PO8. \u{2705} \n
\u{2705} Please make sure that you follow the instructions.  \u{2705} \n\n
PO8 Memo \u{2757}\u{2757}\u{2757}\u{2757} \n
We will send PO8 for you with PO8 DEPOSITE ADDRESS on DOBI EXCHANGE\n
\u{2705} Time: End date airdrop. \u{1F4C6}\u{1F4C6}\u{1F4C6} \n
\u{2705} PLEASE update “ \u{1F449} PO8 ADDRESS on DOBI \u{1F448}“ of your. \n\n
\u{1F525}\u{1F525} In order to update address receive PO8 \u{1F525}\u{1F525} \n
Use bot of us with command:\n
\u{2705} "/po8_address_dobi <PO8 Address In Dobi>"\n
Example: /po8_address_dobi 0xE780c57Fe72e693210754A410496c19E4***** \n\n   
\u{2705} GUIDE GET PO8 DEPOSITE ADDRESS IN DOBI: \n 
https://www.youtube.com/watch?v=a4O-uLfeIkE&feature=youtu.be \n
     Hope you will update before the airdrop end time\n
\u{2764}\u{2764} Thank you for listening \u{2764}\u{2764} `;
    await bot.sendMessage(Config.group_po8, msg);
  }catch (err) {
    console.log('error sendMessage : ',err);
  }
}

export default {
  cronTime: "*/60 * * * *",
  onTick: async () =>{
    try{
      await Promise.all([
        sendMessage()
      ]);
    }catch (err) {
      console.log(err);
    }
  },
  start:true
}
