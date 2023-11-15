const { default: mongoose } = require("mongoose");
// const Appointment = require("../models/Appointment");
// const DaySlot = require("../models/DaySlot");
// const { errorLog } = require("../utils/errorLog");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW APPOINTMENT
// @route     POST /api/v1/appointments
// @access    protect
exports.createAppointment = async (req, res) => {
  try {
    if (req.body.bookingDate) {
      const targetDate = new Date(req.body.bookingDate);
      const existingBooking = await Appointment.aggregate([
        {
          $match: {
            bookingDate: {
              $gte: new Date(targetDate.toISOString().split("T")[0]),
              $lt: new Date(
                targetDate.toISOString().split("T")[0] + "T23:59:59.999Z"
              ),
            },
          },
        },
      ]);
      req.body.bookingId = `DFMS-${existingBooking.length + 1 || 1}`;
    }
    const isSchedule = await Appointment.find({
      user: req.body?.user,
      appointmentStatus: { $ne: "Closed" },
    });

    if (isSchedule?.length) {
      return res.status(200).json({
        success: false,
        message: "Already have an appointment",
        response: isSchedule,
      });
    }

    const lastAppointment = await Appointment.findOne({
      user: req.body?.user,
      appointmentStatus: "Scheduled",
    });

    // if (lastAppointment && !req.body?.dietician) {
    if (req.body?.appointmentStatus === "Admission") {
      console.log("calling", req.body);

      const updatedAppointment = await Appointment.findByIdAndUpdate(
        {
          _id: lastAppointment._id,
        },
        {
          $set: {
            admissionType: "IN",
            appointmentStatus: "In Progress",
            roomNumber: lastAppointment?.roomNumber,
            admissionDate: lastAppointment?.admissionDate,
            dischargeDate: lastAppointment?.dischargeDate,
          },
        }
      );

      if (!updatedAppointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });
      // } else if (req.body?.dietician) {
    } else if (req.body) {
      const newAppointment = await Appointment.create({
        ...req.body,
        center: req.body.center || null,
        franchise: req.body.franchise || null,
        dietician: req.body.dietician || null,
        // franchise: req.user?.franchise,
        appointmentStatus: req.body?.admissionDate ? "Admission" : "Scheduled",
      });

      return res.status(200).json({
        success: true,
        message: "Appointment created successfully",
        data: newAppointment,
      });
    } else {
      // If none of the above conditions are met, send a default response
      return res.status(200).json({
        success: false,
        message: "No Active Appointment",
      });
    }
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL APPOINTMENT & APPOINTMENTs
// @route     GET /api/v1/appointments
// @access    protect
exports.getAppointment = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    // const regex = new RegExp(searchkey, "i");
    // const userMatchesRegex = Object.values(data.user).some((value) =>
    //   regex.test(value)
    // );

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
    }

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      // query.admissionType = "IN";
    }

    query.appointmentStatus = {
      $nin: ["Admission", "Closed"],
    };

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log("ERROLOG", err);
    const error = "eeee";
    errorLog(req, err, error);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC APPOINTMENT
// @route     PUT /api/v1/appointments/:id
// @access    protect
exports.updateAppointment = async (req, res) => {
  try {
    if (req.body?.dischargeDate) {
      req.body.admissionType = "OUT";
      req.body.appointmentStatus = "Closed";
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC APPOINTMENT
// @route     DELETE /api/v1/appointments/:id
// @access    protect
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.query.id, {
      new: true,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      FILTER APPOINTMENT
// @route     GET /api/v1/appointment/filter
// @access    protect
exports.filterAppointment = async (req, res) => {
  try {
    const { date, user, bookingSlot, bookingId } = req.query;
    const filters = {};

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filters.bookingDate = { $gte: startDate, $lt: endDate };
    }

    // Filter by user
    if (user) {
      filters["user"] = user;
    }

    // Filter by booking slot
    if (bookingSlot) {
      filters.appointmentStatus = bookingSlot;
    }

    // Filter by booking ID
    if (bookingId) {
      filters.bookingId = bookingId;
    }
    const appointments = await Appointment.find(filters).populate(
      "user dietician"
    );
    // .populate("user")
    // .populate("dietician")
    // .populate("subscriberMealPlanEntry");
    // .populate("bookingSlot");

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
        filters,
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      date: appointments,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ACTIVE APPOINTMENT & APPOINTMENTs
// @route     GET /api/v1/appointments/active
// @access    protect
exports.activeAdmission = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    }

    if (startDate && endDate) {
      query.admissionDate = {
        $gte: startDate,
        $lte: endDate,
      };
      query.admissionType = "IN";
    } else {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      query.admissionType = "IN";
    }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      // Appointment.find({ ...query })
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ACTIVE APPOINTMENTS
// @route     GET /api/v1/appointments/active-appointments
// @access    protect
exports.activeAppointments = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await TypeOfDiet.findById(id);
      return res.status(200).json({
        success: true,
        message: `specific type of diet`,
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, typeOfDietName: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    // else {
    //   const currentDate = new Date();
    //   const startOfDay = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate(),
    //     0,
    //     0,
    //     0
    //   );
    //   const endOfDay = new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate(),
    //     23,
    //     59,
    //     59
    //   );
    //   query.bookingDate = {
    //     $gte: startOfDay,
    //     $lte: endOfDay,
    //   };
    // }

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      Appointment.find({
        ...query,
        dischargeDate: null,
        appointmentStatus: { $ne: "Closed" },
      })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10)
        .populate("user dietician bookingSlot"),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
      response: data,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ALL ADMISSION HISTORY
// @route     GET /api/v1/appointments/admission-history
// @access    protect
exports.admissionHistory = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
    }

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      // query.admissionType = "IN";
    }

    query.appointmentStatus = "Admission";

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      CHECK IS SCHEDULED
// @route     GET /api/v1/appointments/is-schedule
// @access    protect
exports.isScheduled = async (req, res) => {
  try {
    const isSchedule = await Appointment.find({
      user: req.body?.user,
      $ne: "Closed",
    });

    if (isSchedule) {
      res.status(200).json({
        success: false,
        message: "already have an appointment",
        response: data,
      });
    }
    res.status(200).json({
      success: true,
      message: "make a appointment",
      response: data,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      CREATE NEW APPOINTMENT
// @route     POST /api/v1/appointments
// @access    protect
exports.createAdmisioHistory = async (req, res) => {
  try {
    const lastAppointment = await Appointment.findOne({
      user: req.body?.user,
      appointmentStatus: "Scheduled",
    });

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      {
        _id: lastAppointment._id,
      },
      {
        $set: {
          admissionType: "IN",
          appointmentStatus: "Admission",
          roomNumber: req.body?.roomNumber,
          admissionDate: req.body?.admissionDate,
          dischargeDate: lastAppointment?.dischargeDate,
        },
      }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Created Admission History successfully",
      response: updatedAppointment,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC APPOINTMENT
// @route     PUT /api/v1/appointments/:id
// @access    protect
exports.updateAdmissionHistory = async (req, res) => {
  try {
    if (req.body?.dischargeDate) {
      req.body.admissionType = "OUT";
      req.body.appointmentStatus = "Closed";
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL ADMISSION HISTORY
// @route     GET /api/v1/appointments/all-admission-history
// @access    protect
exports.allAdmissionHistory = async (req, res) => {
  try {
    const { id, skip, limit, searchkey, startDate, endDate } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Appointment.findById(id)
        .populate("user")
        //   .populate("timeSlot")
        .populate("dietician");
      // .populate("subscriberMealPlanEntry");
      return res.status(200).json({
        success: true,
        message: "Retrieved specific appointment list",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, bookingId: { $regex: searchkey, $options: "i" } }
      : req.filter;

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user._id;
      query.franchise = new mongoose.Types.ObjectId(req.user.franchise);
    } else if (req.user?.userType?.role === "Admin") {
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
    }

    if (startDate && endDate) {
      query.bookingDate = {
        $gte: startDate,
        $lte: endDate,
      };
      // query.admissionType = "IN";
    }

    // query.appointmentStatus = "Admission";

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Appointment.countDocuments(),
      parseInt(skip) === 0 && Appointment.countDocuments(query),
      Appointment.find(query)
        .sort({ _id: -1 })
        .populate("user")
        .populate("bookingSlot")
        .populate("dietician")
        // .populate("subscriberMealPlanEntry")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 10),
    ]);

    res.status(200).json({
      success: true,
      message: "Retrieved all appointment list",
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
