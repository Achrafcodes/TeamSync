import mongoose from 'mongoose';

const ConnectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log();
    console.log('db connected Succ !');
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

export default ConnectDb;

console.log('hello ');
