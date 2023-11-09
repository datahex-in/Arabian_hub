const { default: mongoose } = require("mongoose");
const IncludedActivity = require("../models/includedActivity");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW INCLUDED ACTIVITY
// @route     POST /api/v1/included-activity
// @access    protect
exports.createIncludedActivity = async (req, res) => {
  try {
    const newIncludedActivity = await IncludedActivity.create(req.body);
    res.status(200).json({
      success: true,
      message: "Included activity created successfully",
      data: newIncludedActivity,
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

// @desc      GET ALL INCLUDED ACTIVITY
// @route     GET /api/v1/included-activity
// @access    public
exports.getIncludedActivity = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await IncludedActivity.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific included activity",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && IncludedActivity.countDocuments(),
      parseInt(skip) === 0 && IncludedActivity.countDocuments(query),
      IncludedActivity.find(query)
        .populate("activity")
        .populate("package")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all included activity`,
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

// @desc      UPDATE SPECIFIC INCLUDED ACTIVITY
// @route     PUT /api/v1/included-activity/:id
// @access    protect
exports.updateIncludedActivity = async (req, res) => {
  try {
    const includedActivity = await IncludedActivity.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!includedActivity) {
      return res.status(404).json({
        success: false,
        message: "Included activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Included activity updated successfully",
      data: includedActivity,
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

// @desc      DELETE SPECIFIC INCLUDED ACTIVITY
// @route     DELETE /api/v1/included-activity/:id
// @access    protect
exports.deleteIncludedActivity = async (req, res) => {
  try {
    const includedActivity = await IncludedActivity.findByIdAndDelete(req.query.id);

    if (!includedActivity) {
      return res.status(404).json({
        success: false,
        message: "Included activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Included activity deleted successfully",
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

// @desc      GET INCLUDED ACTIVITY BY PACKAGE
// @route     GET /api/v1/included-activity/get-includedactivity-by-package
// @access    protect
exports.getIncludedActivityByPackage = async (req, res) => {
  try {
      if (!isValidObjectId(req.query.package)) {
          return res.status(200).json([]);
      }
      const items = await IncludedActivity.find({ package: req.query.package ?? "" }, { _id: 0, id: "$_id", value: "$title" }).populate("package");
      res.status(200).json(items);
  } catch (err) {
      console.log(err);
      res.status(400).json({
          success: false,
          message: err,
      });
  }
};