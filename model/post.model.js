import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = new Schema({
  telegram_id: {type: String, index: true},
  link: {type: String, require: true},
  social: {type: String, enum: ['facebook', 'telegram', 'twitter']}
});

export default mongoose.model('post', Post);
