import mongoose, { Schema } from 'mongoose';

const TasksSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'done'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    assignedTo: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model('Task', TasksSchema);
