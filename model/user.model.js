import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: 'String', index: true},
  firstName: {type: String},
  lastName: {type: String},
  ethAddress: {type: String},
  telegram_id: {type: Number, index: true},
  balance: {type: Number, default: 0},
  claim: {type: Boolean, default: false},
  invited_by: {type: String, index: true},
  airdrop_received: {type: Boolean, default: false, index: true},
  ref_count: {type: Number, default: 0}
});

userSchema.index({email: 1, ethAddress: 1, airdrop_received: 1, balance: -1});

export default mongoose.model('User', userSchema);
