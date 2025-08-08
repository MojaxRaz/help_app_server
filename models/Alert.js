const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const alertSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    description: String,
    location: {
      lat: Number,
      lng: Number,
      address: String,
    },
    status: {
      type: String,
      enum: ["active", "resolved", "expired"],
      default: "active",
    },
    comments: [commentSchema],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // auto-delete after 1 hour
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
