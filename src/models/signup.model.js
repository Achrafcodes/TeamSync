import mongoose from "mongoose";

const NewUserSchema = new mongoose.Schema({
  username : {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})
