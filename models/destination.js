const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    thumbnailImage: {
      type: String,
    },
    bannerImage: {
      type: String,
    },
    detailedPageTitle: {
      type: String,
    },
    detailedPageDescription: {
      type: String,    
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destination", DestinationSchema);
