const mongoose = require("mongoose");

const ErrorLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    api: {
      type: String,
    },
    method: {
      type: String,
    },
    headers: {
      type: String,
    },
    query: {
      type: String,
    },
    body: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    error: {
      message: String,
      stack: String,
    },
    status: {
      type: String,
      // enum: ["Occurred", "Solved"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ErrorLog", ErrorLogSchema);
