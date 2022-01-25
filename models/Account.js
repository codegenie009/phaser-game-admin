import mongoose from 'mongoose';

const { Schema } = mongoose;

const AccountSchema = new Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  },
  player_num: {
    type: Number,
    require: true
  },
  total_point: {
    type: Number,
  },
  cur_point: {
    type: Number
  },
  unlocked_skin: {
    type: String
  },
  country: {
    type: String
  },
  os: {
    type: String
  },
  mobile_type: {
    type: String
  },
  referral: {
    type: String
  },
  account_type: {
    type: String
  },
  team: {
    type: String
  },
  team_join_date: {
    type: Date
  },
  team_exit_date: {
    type: Date
  }
});

const Account = mongoose.model('account', AccountSchema);

export default Account;