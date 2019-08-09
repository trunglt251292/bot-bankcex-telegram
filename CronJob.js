import cron from 'cron';
import sendMessage from "./send_message";

export default function Cronjobs() {
  new cron.CronJob(sendMessage)
}
