import User from '../models/User.js';

export const registerUser = async (userData) => {
  try {
    let user = await User.findOne({ name: userData.name });
    if (!user) {
      user = new User({
        name: userData.name,
        profilePicture: userData.profilePicture || '/images/default-profile.png',
        online: true
      });
      await user.save();
    } else {
      // Mark the user as online if already registered
      user.online = true;
      await user.save();
    }
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getOnlineUsers = async () => {
  try {
    const users = await User.find({ online: true });
    return users;
  } catch (error) {
    console.error('Error fetching online users:', error);
    throw error;
  }
};

export const userDisconnected = async (name) => {
  try {
    await User.findOneAndUpdate({ name }, { online: false });
  } catch (error) {
    console.error('Error updating user disconnection:', error);
  }
};
