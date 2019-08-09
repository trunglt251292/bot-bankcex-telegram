import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  chat_id: {type: Number, index: true, required: true},
  context: {
    type: String,
    enum: ['normal', 'email', 'eth', 'facebook', 'telegram', 'twitter'],
    default: 'normal'
  }
});

export default mongoose.model('conversation', conversationSchema);
