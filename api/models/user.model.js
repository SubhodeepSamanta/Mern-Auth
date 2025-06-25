import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4UqtveShnljVRyv6Yjhhl34q5wROeK1NZwA&s"
  },
},{
  timestamps: true
});
const User = mongoose.model('User', userSchema);
export default User;