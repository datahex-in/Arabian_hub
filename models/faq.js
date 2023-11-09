const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("faq", FaqSchema);
