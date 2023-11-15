const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    instagram: {
      type: String,    
    },
    facebook: {
      type: String,
    },
    twitter: {
      type: String
    },
    youtube: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);
