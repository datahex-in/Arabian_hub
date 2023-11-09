const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    cprNumber: {
      type: String,
      // unique: true,
      // required: true,
    },
    fullName: {
      type: String,
    },
    mobile: {
      type: Number,
      // required: true,
    },
    userDisplayName: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      // unique: true,
      // required: true,
    },

    middleName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    // email: {
    //   type: String,
    //   unique: true,
    //   // required: true,
    //   match: [
    //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    //     "Please add a valid email",
    //   ],
    // },

    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    authType: {
      type: String,
      // enum: ["usernamePassword", "google", "apple"],
      default: "usernamePassword",
    },
    authKey: {
      type: String,
    },
    userType: {
      type: mongoose.Schema.ObjectId,
      ref: "UserType",
      default: null,
    },
    userImage: {
      type: String,
    },
    fathername: {
      type: String,
    },
    mothername: {
      type: String,
    },
    occupation: {
      type: String,
    },
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nationality",
    },
    franchise: {
      type: mongoose.Schema.ObjectId,
      ref: "Franchise",
      default: null,
    },
    identityType: {
      type: String,
    },
    identityImage: {
      type: String,
    },
    identityNumber: {
      type: String,
    },
    school: {
      type: String,
    },
    rollNumber: {
      type: String,
    },
    division: {
      type: String,
    },
    grade: {
      type: String,
    },
    deliveryManLocation: {
      type: mongoose.Schema.ObjectId,
      ref: "DeliverymanLocation",
      default: null,
    },
    vehicleType: {
      type: mongoose.Schema.ObjectId,
      ref: "VehicleCategory",
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    deletedDate: {
      type: String,
      default: null,
    },

    mohLicense: {
      type: String,
    },
    licenseValidity: {
      type: Date,
    },
    speciality: {
      type: String,
    },
    qualification: {
      type: String,
    },
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nationality",
    },
    branchName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietCentreBranch",
    },
    identityType: {
      type: String,
    },
    identityDocument: {
      type: String,
    },
    identityNumber: {
      type: String,
    },
    employeeID: {
      type: String,
    },
    gender: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Leave", "Resigned", "Terminated"],
    },
    // employeeID: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

UserSchema.path("email").validate(async function (value) {
  // Check if the email already exists in the database
  const user = await mongoose.model("User").findOne({ email: value });
  return !user;
}, "Email already exists");

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
