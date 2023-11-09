const jwt = require("jsonwebtoken");
//
const User = require("../models/User");
// const UserSubscriber = require("../models/UserSubscriber");
const { default: mongoose } = require("mongoose");
const { query } = require("express");
const bcrypt = require("bcryptjs");
const { errorLog } = require("../utils/errorLog");

// @desc      create user
// @route     POST /api/v1/user
// @access    public
exports.addUser = async (req, res) => {
  console.log(req.body);
  try {
    const {
      username,
      userDisplayName,
      cprNumber,
      email,
      password,
      gender,
      franchise,
      userType,
      address,
      dateOfBirth,
      userImage,
      mobile,
      deliveryManLocation,
      vehicleType,
      identityType,
      identityDocument,
      identityNumber,
      mohLicense,
      licenseValidity,
      speciality,
      qualification,
      branchName,
      status,
      middleName,
      lastName,
      occupation,
      nationality,
      mothername,
      fathername,
    } = req.body;

    console.log("full name", username + " " + middleName + " " + lastName);

    const employeeCount = await User.find({ userType }).populate("userType");

    let employeeID;

    if (employeeCount[0]?.userType?.role === "Dietician") {
      employeeID = `DT-${employeeCount?.length + 1}`;
    }
    if (employeeCount[0]?.userType?.role === "Delivery Man") {
      employeeID = `DLV-${employeeCount?.length + 1}`;
    }

    const user = await User.create({
      username,
      userDisplayName,
      cprNumber,
      email,
      password,
      userImage,
      mobile,
      deliveryManLocation,
      vehicleType,
      userType: req.body?.userType
        ? req.body?.userType
        : new mongoose.Types.ObjectId(req.user?.userType?._id),
      franchise: new mongoose.Types.ObjectId(franchise),
      employeeID,
      identityType,
      identityDocument,
      identityNumber,
      mohLicense,
      licenseValidity,
      speciality,
      qualification,
      branchName,
      nationality,
      status,
      middleName,
      lastName,
      occupation,
      nationality,
      mothername,
      fathername,
      gender,
      fullName: username + " " + middleName + " " + lastName,
    });

    // Create the userSubscriber
    const userSubscriber = await UserSubscriber.create({
      cprNumber,
      address,
      gender,
      user: user._id,
      dateOfBirth,
    });

    res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user,
      userSubscriber,
    });
  } catch (err) {
    console.log("Error:", err);
    errorLog(req, err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      get all users
// @route     GET /api/v1/user
// @access    public
exports.getUser = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    // const matchQuery = {};
    const matchQuery = searchkey
      ? {
          ...req.filter,
          userDisplayName: { $regex: searchkey, $options: "i" },
        }
      : req.filter;

    matchQuery.delete = false;

    if (req.filter.userType && mongoose.isValidObjectId(req.filter.userType)) {
      matchQuery.userType = new mongoose.Types.ObjectId(req.filter.userType);
      if (req.query?.franchise) {
        matchQuery.franchise = new mongoose.Types.ObjectId(req.query.franchise);
      }
    }
    if (req.filter?.branchName) {
      matchQuery.branchName = new mongoose.Types.ObjectId(
        req.filter.branchName
      );
    }

    if (id && mongoose.isValidObjectId(id)) {
      matchQuery._id = new mongoose.Types.ObjectId(id);
    }

    if (searchkey) {
      const regexSearch = { $regex: searchkey, $options: "i" };
      matchQuery.$or = [
        { userDisplayName: regexSearch },
        { firstName: regexSearch },
        { username: regexSearch },
        { location: regexSearch },
        { email: regexSearch },
      ];
    }

    const pipeline = [
      {
        $sort: { _id: -1 },
      },
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "usertypes",
          localField: "userType",
          foreignField: "_id",
          as: "userType",
        },
      },
      {
        $lookup: {
          from: "franchises",
          localField: "franchise",
          foreignField: "_id",
          as: "franchise",
        },
      },
      {
        $lookup: {
          from: "subscribers",
          localField: "_id",
          foreignField: "user",
          as: "subscriber",
        },
      },
      {
        $lookup: {
          from: "deliverymanlocations",
          localField: "deliveryManLocation",
          foreignField: "_id",
          as: "deliveryManLocation",
        },
      },
      {
        $lookup: {
          from: "vehiclecategories",
          localField: "vehicleType",
          foreignField: "_id",
          as: "vehicleType",
        },
      },
      {
        $lookup: {
          from: "dietcentrebranches",
          localField: "branchName",
          foreignField: "_id",
          as: "branchName",
        },
      },
      {
        $lookup: {
          from: "nationalities",
          localField: "nationality",
          foreignField: "_id",
          as: "nationality",
        },
      },
      {
        $addFields: {
          deliveryManLocation: {
            $arrayElemAt: ["$deliveryManLocation", 0],
          },
        },
      },
      {
        $addFields: {
          vehicleType: {
            $arrayElemAt: ["$vehicleType", 0],
          },
        },
      },
      {
        $addFields: {
          branchName: {
            $arrayElemAt: ["$branchName", 0],
          },
        },
      },
      {
        $addFields: {
          nationality: {
            $arrayElemAt: ["$nationality", 0],
          },
        },
      },
      {
        $project: {
          userType: { $arrayElemAt: ["$userType", 0] },
          franchise: { $arrayElemAt: ["$franchise", 0] },
          subscriber: { $arrayElemAt: ["$subscriber", 0] },
          cprNumber: 1,
          username: 1,
          email: 1,
          userDisplayName: 1,
          userImage: 1,
          deliveryManLocation: 1,
          mobile: 1,
          // deliveryManLocation: 1,
          vehicleType: 1,
          identityType: 1,
          identityNumber: 1,
          identityDocument: 1,
          employeeID: 1,
          licenseValidity: 1,
          speciality: 1,
          qualification: 1,
          mohLicense: 1,
          nationality: 1,
          branchName: 1,
          status: 1,
          middleName: 1,
          lastName: 1,
          gender: 1,
          occupation: 1,
          nationality: 1,
          mothername: 1,
          fathername: 1,
          fullName: 1,
        },
      },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(limit) || 10 },
    ];

    const subscriber = UserSubscriber.find({ user: id });

    const [data, filterCount, totalCount] = await Promise.all([
      User.aggregate(pipeline).sort({ _id: -1 }),
      parseInt(skip) === 0 && User.countDocuments(matchQuery),
      parseInt(skip) === 0 && User.countDocuments(),
    ]);

    data.gender = subscriber?.gender;

    res.status(200).json({
      success: true,
      message: id ? "Retrieved specific User" : "Retrieved all Users",
      response: id ? data[0] : data,
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

// @desc      update user
// @route     PUT /api/v1/user
// @access    public
exports.updateUser = async (req, res) => {
  console.log("all datas", req.body);
  try {
    const {
      id,
      address,
      gender,
      username,
      userDisplayName,
      email,
      userImage,
      franchise,
      userType,
      mobile,
      deliveryManLocation,
      vehicleType,
      mohLicense,
      licenseValidity,
      speciality,
      qualification,
      branchName,
      status,
      middleName,
      lastName,
      employeeID,
      identityType,
      identityNumber,
      identityDocument,
      occupation,
      nationality,
      mothername,
      fathername,
    } = req.body;
    const response = await User.findByIdAndUpdate(
      id,
      { ...req.body, fullName: username + " " + middleName + " " + lastName },
      { new: true }
    );

    const resp = await UserSubscriber.findOneAndUpdate(
      { user: id },
      {
        address,
        gender,
      }
    );

    return res.status(200).json({
      success: true,
      message: `updated specific sub menu`,
      response,
      resp,
    });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

// @desc      update user field
// @route     PATCH /api/v1/user/update_user_field
// @access    public
exports.updateUserField = async (req, res) => {
  try {
    res.status(200).json({
      message: "successfully updated",
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

// @desc      delete user
// @route     DELETE /api/v1/user
// @access    public
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    const token = req.headers.authorization.split(" ")[1];

    const response = await User.findByIdAndUpdate(id, {
      delete: true,
      deletedBy: id,
      deletedDate: new Date(),
    });
    res.status(200).json({
      success: true,
      message: "succefully deleted",
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

// @desc      filter user with user type
// @route     GET /api/v1/user/filter-user
// @access    protect
exports.filterUser = async (req, res) => {
  try {
    const { id } = req.query;
    const response = await User.find({ userType: id });
    res.status(200).json({
      success: true,
      message: "filtered data",
      data: response,
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

// @desc      GET USER'S
// @route     DELETE /api/v1/user/select
// @access    protect
exports.select = async (req, res) => {
  try {
    // const role = req.query?.userType?.replace(/\?$/, "") || "";
    const idPattern = /^[a-zA-Z0-9]+/;
    const role = req.query?.userType.match(idPattern)?.[0] || "";
    let query = {};
    query.status = "Active";

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user?._id;
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    } else if (req.user?.userType?.role === "Admin") {
      query.userType = role;
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = role;
    }

    const items = await User.find(query, {
      _id: 0,
      id: "$_id",
      value: "$userDisplayName",
      Name: "$username",
      CprNumber: "$cprNumber",
      Email: "$email",
    });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      update password
// @route     PUT /api/v1/user/update-passoword
// @access    protect
exports.updatePassword = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.newPassword, salt);

    const response = await User.findByIdAndUpdate(
      req.body?.user,
      {
        password,
      },
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `updated specific sub menu`,
      response,
    });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

// @desc      get deleted user's
// @route     GET /api/v1/user/user-deletion
// @access    protect
exports.deletedUser = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    const matchQuery = {};
    matchQuery.delete = true;

    if (req.filter.userType && mongoose.isValidObjectId(req.filter.userType)) {
      matchQuery.userType = new mongoose.Types.ObjectId(req.filter.userType);
      if (req.query?.franchise) {
        matchQuery.franchise = new mongoose.Types.ObjectId(req.query.franchise);
      }
    }

    if (id && mongoose.isValidObjectId(id)) {
      matchQuery._id = new mongoose.Types.ObjectId(id);
    }

    if (searchkey) {
      const regexSearch = { $regex: searchkey, $options: "i" };
      matchQuery.$or = [
        { userDisplayName: regexSearch },
        { username: regexSearch },
        { location: regexSearch },
      ];
    }

    const pipeline = [
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "usertypes",
          localField: "userType",
          foreignField: "_id",
          as: "userType",
        },
      },
      {
        $lookup: {
          from: "franchises",
          localField: "franchise",
          foreignField: "_id",
          as: "franchise",
        },
      },
      {
        $lookup: {
          from: "subscribers",
          localField: "_id",
          foreignField: "user",
          as: "subscriber",
        },
      },
      {
        $lookup: {
          from: "deliverymanlocations",
          localField: "deliveryManLocation",
          foreignField: "_id",
          as: "deliveryManLocation",
        },
      },
      {
        $lookup: {
          from: "vehiclecategories",
          localField: "vehicleType",
          foreignField: "_id",
          as: "vehicleType",
        },
      },
      {
        $lookup: {
          from: "dietcentrebranches",
          localField: "branchName",
          foreignField: "_id",
          as: "branchName",
        },
      },
      {
        $lookup: {
          from: "nationalities",
          localField: "nationality",
          foreignField: "_id",
          as: "nationality",
        },
      },
      {
        $addFields: {
          deliveryManLocation: {
            $arrayElemAt: ["$deliveryManLocation.deliveryLocation", 0],
          },
        },
      },
      {
        $addFields: {
          vehicleType: {
            $arrayElemAt: ["$vehicleType.vehicleType", 0],
          },
        },
      },
      {
        $addFields: {
          branchName: {
            $arrayElemAt: ["$branchName.name", 0],
          },
        },
      },
      {
        $addFields: {
          nationality: {
            $arrayElemAt: ["$nationality.nationality", 0],
          },
        },
      },
      {
        $project: {
          userType: { $arrayElemAt: ["$userType", 0] },
          franchise: { $arrayElemAt: ["$franchise", 0] },
          subscriber: { $arrayElemAt: ["$subscriber", 0] },
          cprNumber: 1,
          username: 1,
          email: 1,
          userDisplayName: 1,
          userImage: 1,
          deliveryManLocation: 1,
          mobile: 1,
          // deliveryManLocation: 1,
          vehicleType: 1,
          identityType: 1,
          identityNumber: 1,
          identityDocument: 1,
          employeeID: 1,
          licenseValidity: 1,
          speciality: 1,
          qualification: 1,
          mohLicense: 1,
          nationality: 1,
          branchName: 1,
          middleName: 1,
          lastName: 1,
        },
      },
      { $skip: parseInt(skip) || 0 },
      { $limit: parseInt(limit) || 10 },
    ];

    const [data, filterCount, totalCount] = await Promise.all([
      User.aggregate(pipeline).sort({ _id: -1 }),
      parseInt(skip) === 0 && User.countDocuments(matchQuery),
      parseInt(skip) === 0 && User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: id ? "Retrieved specific User" : "Retrieved all Users",
      response: id ? data[0] : data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    // errorLog(req, err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      restore user
// @route     PUT /api/v1/user/user-deletion
// @access    protect
exports.restoreUser = async (req, res) => {
  try {
    const response = await User.findByIdAndUpdate(
      req.body?._id,
      {
        delete: false,
        deletedBy: req.user?._id,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `updated specific sub menu`,
      response,
    });
  } catch (err) {
    console.log("Error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

// @desc      GET USER'S
// @route     DELETE /api/v1/user/select
// @access    protect
exports.selectDietitian = async (req, res) => {
  try {
    const items = await User.find(
      {
        userType: req.query?.userType,
        branchName: req.query?.center || null,
      },
      {
        _id: 0,
        id: "$_id",
        value: "$userDisplayName",
        Name: "$username",
        CprNumber: "$cprNumber",
        Email: "$email",
      }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET USER'S
// @route     DELETE /api/v1/user/select
// @access    protect
exports.branchDietitian = async (req, res) => {
  try {
    // const role = req.query?.userType?.replace(/\?$/, "") || "";
    const idPattern = /^[a-zA-Z0-9]+/;
    const userTypeQueryParam = req.query?.userType || "";
    const userTypeMatch = userTypeQueryParam.match(idPattern);

    // Extract userType and center values
    const userType = userTypeMatch?.[0] || "";
    const center = userTypeQueryParam.split("?")[1]?.split("=")[1] || "";

    let query = {};
    query.branchName = center || null;
    query.status = "Active";

    if (req.user?.userType?.role === "Dietician") {
      query.dietician = req.user?._id;
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = userType;
    } else if (req.user?.userType?.role === "Admin") {
      query.userType = userType;
    } else {
      query.franchise = new mongoose.Types.ObjectId(req.user?.franchise);
      query.userType = userType;
    }
    const items = await User.find(query, {
      _id: 0,
      id: "$_id",
      value: "$userDisplayName",
      Name: "$username",
      CprNumber: "$cprNumber",
      Email: "$email",
    });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    errorLog(req, err);
    res.status(204).json({
      success: false,
      message: err,
    });
  }
};
