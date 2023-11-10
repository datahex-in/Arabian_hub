const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    time: {
      type: String,    
    },
    location: {
      type: String,    
    },
    noOfPersons: {
      type: Number,    
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
