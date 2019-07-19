import kue from 'kue';
import basicAuth from 'basic-auth-connect';
import configs from '../config';

const queue = kue.createQueue(configs.kue);
let app = kue.app;
app.set('title', 'Kue Service');
app.use(basicAuth(configs.kueUI.username, configs.kueUI.password));

queue.kue = kue;

exports.Q = queue;
exports.queueUI = app;
