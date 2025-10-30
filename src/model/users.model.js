import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 6,
      required: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

UserSchema.pre('save', async function (next) {
  try {
    // first we will check if the pw was modified or no
    if (!this.isModified('password')) return next();

    // we will define the salt
    const salt = await bcrypt.genSalt(12);

    // we hash the pw
    const hash = await bcrypt.hash(this.password, salt);
    // now we redefin the hashed pw in place of the old pw
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});
UserSchema.methods.ComparePassword = async function (userInput) {
  return await bcrypt.compare(userInput, this.password);
};
export default mongoose.model('User', UserSchema);
