import mongoose from 'mongoose';
const { Schema } = mongoose
// Create Schema
const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  member_count: {
    type: Number,
    required: true,
  },
}, 
{
  timestamps: true 
});

const Team = mongoose.model('team', TeamSchema);

export default Team;