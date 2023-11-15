const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    countryCode: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    message: {
        type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
