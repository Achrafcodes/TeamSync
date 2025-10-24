import mongoose from 'mongoose';
import bcrypt, { compare } from 'bcrypt';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [3, 'name must be at least 3 characters!'],
    maxlength: [50, 'name must be maximum 50 characters'],
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // basic email regex
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'password must be atleast 6 characters'],
  },
});
// hash the ps

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
const Usermodel = mongoose.model('User', UserSchema);
export default Usermodel;
