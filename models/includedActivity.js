const mongoose = require("mongoose");

const IncludedActivitySchema = new mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity"
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Package"
      },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncludedActivity", IncludedActivitySchema);
