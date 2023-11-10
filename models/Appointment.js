const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bookingId: {
      type: String,
    },
    bookingDate: {
      type: Date,
    },
    bookingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DaySlot",
    },
    day: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    numBookings: {
      type: String,
    },
    dietician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // subscriberMealPlanEntry: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "SubscriberMealPlanEntry",
    // },
    dischargeDate: {
      type: Date,
      default: null,
    },
    admissionDate: {
      type: Date,
      default: null,
    },
    admissionType: {
      type: String,
      // default: "IN",
      default: null,
    },
    roomNumber: {
      type: String,
    },
    appointmentStatus: {
      type: String,
      enum: ["Scheduled", "Admission", "In Progress", "Closed"],
      default: "Scheduled",
    },
    franchise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Franchise",
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietCentreBranch",
    },
    physical: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
