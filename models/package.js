const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    duration: {
      type: String,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination"
    },
    language: {
      type: String,    
    },
    location: {
      type: String,
    },
    included: {
      type: String
    },
    excluded: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);
