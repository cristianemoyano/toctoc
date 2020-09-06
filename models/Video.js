const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  public_id: { type: String, unique: true },
  version: Number,
  signature: { type: String, unique: true },
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
  created_at: String,
  bytes: Number,
  type: String,
  url: String,
  secure_url: String,
  video_title: String,
  user_email: String,

}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
