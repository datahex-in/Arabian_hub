const User = require("../models/User");
const Appointment = require("../models/Appointment");
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const { errorLog } = require("../utils/errorLog");
// const Recipe = require("../models/Recipe");

// @desc      GET COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard
// @access    protect
exports.count = async (req, res) => {
  try {
    if (req.user?.userType?.role === "Dietician") {
      const pipeline = [
        {
          $match: {
            dietician: new mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          $group: {
            _id: null,
            patients: { $sum: 1 },
            admittedPatients: {
              $sum: {
                $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
              },
            },
          },
        },
      ];

      const result = await Appointment.aggregate(pipeline);

      const { patients, admittedPatients } = result[0];

      res.status(200).json([
        {
          count: admittedPatients,
          title: "Admitted Patients",
          icon: "patient",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: patients,
          title: "Patients",
          icon: "patient",
          background: "#ebf1fb",
          color: "#5753cd",
        },
      ]);
    } else if (req.user?.userType?.role === "Admin") {
      const [
        dieticianCount,
        patientCount,
        deliveryManCount,
        // menuCount,
        recipeCount,
        // activeAdmissionCount,
      ] = await Promise.all([
        User.countDocuments({ userType: "6471b34d9fb2b29fe0458878" }),
        User.countDocuments({ userType: "6471b3849fb2b29fe045887b" }),
        User.countDocuments({ userType: "64815bde89e0a44fc31c53b0" }),
        // Recipe.countDocuments(),
      ]);

      const targetDate = new Date();
      const startOfDay = moment(targetDate).startOf("day").toDate();
      const endOfDay = moment(targetDate).endOf("day").toDate();
      const activeAppointmentCount = await Appointment.countDocuments({
        bookingDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      const today = new Date();
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const startOfThisWeek = new Date(today);
      startOfThisWeek.setDate(today.getDate() - today.getDay());
      startOfThisWeek.setHours(0, 0, 0, 0);

      const startOfThisMonth = new Date(today);
      startOfThisMonth.setDate(1);
      startOfThisMonth.setHours(0, 0, 0, 0);

      const todays = await Appointment.countDocuments({
        bookingDate: {
          $gte: today,
          $lte: endOfToday,
        },
      });

      const week = await Appointment.countDocuments({
        bookingDate: {
          $gte: startOfThisWeek,
          $lte: endOfToday,
        },
      });

      const month = await Appointment.countDocuments({
        bookingDate: {
          $gte: startOfThisMonth,
          $lte: endOfToday,
        },
      });

      const appointments = await Appointment.find();

      const userIdCounts = {};

      appointments.forEach((appointment) => {
        const userId = appointment?.user?.toString();

        if (userIdCounts[userId]) {
          userIdCounts[userId]++;
        } else {
          userIdCounts[userId] = 1;
        }
      });

      const uniqueUserIdsArray = appointments
        .filter((appointment) => {
          const userId = appointment?.user?.toString();
          return userIdCounts[userId] === 1;
        })
        .map((appointment) => appointment?.user);

      console.log(uniqueUserIdsArray);
      // res.status(200).json({
      //   newAppointments: uniqueUserIdsArray.length,
      // });

      res.status(200).json([
        // {
        //   count: menuCount,
        //   title: "Menu",
        //   icon: "menu",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        {
          count: recipeCount,
          title: "Recipe",
          icon: "recipe",
          background: "#ebf1fb",
          color: "#5753cd",
        },
        {
          count: todays,
          title: "Today Appointments",
          icon: "patient",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: week,
          title: "Weekly Appointments",
          icon: "patient",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: month,
          title: "Monthly Appointments",
          icon: "patient",
          background: "#fbe2f0",
          color: "rgb(252 121 127)",
        },
        {
          count: uniqueUserIdsArray.length,
          title: "New Appointment",
          icon: "activeAppointment",
          background: "#ebf1fb",
          color: "#5753cd",
        },
        // {
        //   count: patientCount,
        //   title: "Patients",
        //   icon: "patient",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        // {
        //   count: deliveryManCount,
        //   title: "Delivery Man",
        //   icon: "deliveryMan",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        // {
        //   count: activeAppointmentCount,
        //   title: "Active Appointment",
        //   icon: "activeAppointment",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
        // {
        //   count: activeAdmissionCount,
        //   title: "Active Admission",
        //   icon: "activeAdmission",
        //   background: "#ebf1fb",
        //   color: "#5753cd",
        // },
      ]);
    }
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc      GET COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard/filter-date
// @access    protect
exports.countWithDate = async (req, res) => {
  try {
    const today = new Date();
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfThisMonth = new Date(today);
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const todays = await Appointment.find({
      bookingDate: {
        $gte: today,
        $lte: endOfToday,
      },
    });

    const week = await Appointment.find({
      bookingDate: {
        $gte: startOfThisWeek,
        $lte: endOfToday,
      },
    });

    const month = await Appointment.find({
      bookingDate: {
        $gte: startOfThisMonth,
        $lte: endOfToday,
      },
    });

    res.status(200).json({
      todays,
      week,
      month,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc      GET PATIENT COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard/dietitian
// @access    protect
exports.patientCount = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          dietician: new mongoose.Types.ObjectId(req.query.dietitian),
        },
      },
      {
        $group: {
          _id: null,
          patients: { $sum: 1 },
          admittedPatients: {
            $sum: {
              $cond: [{ $ne: ["$admissionDate", null] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await Appointment.aggregate(pipeline);

    const { patients, admittedPatients } = result[0];

    res.status(200).json({
      patients,
      admittedPatients,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc      GET COUNTS FOR DASHBOARED
// @route     GET /api/v1/dashboard/filter-date
// @access    protect
exports.newAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();

    const userIdCounts = {};

    appointments.forEach((appointment) => {
      const userId = appointment.user.toString();

      if (userIdCounts[userId]) {
        userIdCounts[userId]++;
      } else {
        userIdCounts[userId] = 1;
      }
    });

    const uniqueUserIdsArray = appointments
      .filter((appointment) => {
        const userId = appointment.user.toString();
        return userIdCounts[userId] === 1;
      })
      .map((appointment) => appointment.user);

    console.log(uniqueUserIdsArray);
    res.status(200).json({
      newAppointments: uniqueUserIdsArray.length,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
