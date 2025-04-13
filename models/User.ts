import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Use existing model if already compiled, otherwise create a new one
export const User = models.User || model('User', userSchema);
