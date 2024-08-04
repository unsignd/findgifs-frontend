import { Schema, model } from 'mongoose';

const gifSchema = new Schema({
  name: [String],
  url: String,
  createdAt: Number,
  createdBy: [
    {
      ip: String,
      date: Number,
    },
  ],
  upvote: [
    {
      ip: String,
      date: Number,
    },
  ],
  isVerified: Boolean,
});

export const Gif = model('gif', gifSchema);