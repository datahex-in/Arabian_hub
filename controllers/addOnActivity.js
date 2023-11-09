const { default: mongoose } = require("mongoose");
const AddOnActivity = require("../models/addOnActivity");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW ADD ON ACTIVITY
// @route     POST /api/v1/add-on-activity
// @access    protect
exports.createAddOnActivity = async (req, res) => {
  try {
    const newAddOnActivity = await AddOnActivity.create(req.body);
    res.status(200).json({
      success: true,
      message: "Add on activity created successfully",
      data: newAddOnActivity,
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

// @desc      GET ALL ADD ON ACTIVITY
// @route     GET /api/v1/add-on-activity
// @access    public
exports.getAddOnActivity = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await AddOnActivity.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific add on activity",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && AddOnActivity.countDocuments(),
      parseInt(skip) === 0 && AddOnActivity.countDocuments(query),
      AddOnActivity.find(query)
        .populate("activity")
        .populate("package")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all add on activity`,
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

// @desc      UPDATE SPECIFIC ADD ON ACTIVITY
// @route     PUT /api/v1/add-on-activity/:id
// @access    protect
exports.updateAddOnActivity = async (req, res) => {
  try {
    const addOnActivity = await AddOnActivity.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!addOnActivity) {
      return res.status(404).json({
        success: false,
        message: "Add on activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Add on activity updated successfully",
      data: addOnActivity,
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

// @desc      DELETE SPECIFIC ADD ON ACTIVITY
// @route     DELETE /api/v1/add-on-activity/:id
// @access    protect
exports.deleteAddOnActivity = async (req, res) => {
  try {
    const addOnActivity = await AddOnActivity.findByIdAndDelete(req.query.id);

    if (!addOnActivity) {
      return res.status(404).json({
        success: false,
        message: "Add on activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Add on activity deleted successfully",
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

// @desc      GET ADD ON ACTIVITY BY PACKAGE
// @route     GET /api/v1/add-on-activity/get-addonactivity-by-package
// @access    protect
exports.getAddOnActivityByPackage = async (req, res) => {
  try {
      if (!isValidObjectId(req.query.package)) {
          return res.status(200).json([]);
      }
      const items = await AddOnActivity.find({ package: req.query.package ?? "" }, { _id: 0, id: "$_id", value: "$title" }).populate("package");
      res.status(200).json(items);
  } catch (err) {
      console.log(err);
      res.status(400).json({
          success: false,
          message: err,
      });
  }
};