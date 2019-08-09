import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Step = new Schema({
  telegram_id: {type: Number, index: true},
  step: {type: Number, default: 0},
});

export default mongoose.model('step', Step);
