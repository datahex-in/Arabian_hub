const { default: mongoose } = require("mongoose");
const TourPlan = require("../models/tourPlan");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW TOUR PLAN
// @route     POST /api/v1/tour-plan
// @access    protect
exports.createTourPlan = async (req, res) => {
  try {
    const newTourPlan = await TourPlan.create(req.body);
    res.status(200).json({
      success: true,
      message: "Tour plan created successfully",
      data: newTourPlan,
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

// @desc      GET ALL TOUR PLAN
// @route     GET /api/v1/tour-plan
// @access    public
exports.getTourPlan = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await TourPlan.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific tour plan",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && TourPlan.countDocuments(),
      parseInt(skip) === 0 && TourPlan.countDocuments(query),
      TourPlan.find(query).populate("package")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all tour plan`,
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

// @desc      UPDATE SPECIFIC TOUR PLAN
// @route     PUT /api/v1/tour-plan/:id
// @access    protect
exports.updateTourPlan = async (req, res) => {
  try {
    const tourPlan = await TourPlan.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!tourPlan) {
      return res.status(404).json({
        success: false,
        message: "Tour plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour plan updated successfully",
      data: tourPlan,
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

// @desc      DELETE SPECIFIC TOUR PLAN
// @route     DELETE /api/v1/tour-plan/:id
// @access    protect
exports.deleteTourPlan = async (req, res) => {
  try {
    const tourPlan = await TourPlan.findByIdAndDelete(req.query.id);

    if (!tourPlan) {
      return res.status(404).json({
        success: false,
        message: "Tour plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour plan deleted successfully",
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

// @desc      GET TOUR PLAN
// @route     GET /api/v1/tour-plan/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await TourPlan.find(
      {},
      { _id: 0, id: "$_id", value: "$title" }
    );
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

// @desc      GET TOUR PLAN BY PACKAGE
// @route     GET /api/v1/tour-plan/get-tourplan-by-package
// @access    protect
exports.getTourPlanByPackage = async (req, res) => {
  try {
      if (!isValidObjectId(req.query.package)) {
          return res.status(200).json([]);
      }
      const items = await TourPlan.find({ package: req.query.package ?? "" }, { _id: 0, id: "$_id", value: "$title" }).populate("package");
      res.status(200).json(items);
  } catch (err) {
      console.log(err);
      res.status(400).json({
          success: false,
          message: err,
      });
  }
};