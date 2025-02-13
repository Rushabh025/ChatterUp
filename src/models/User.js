import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: '/images/default-profile.png' },
  online: { type: Boolean, default: false }
});

export default mongoose.model('User', UserSchema);
