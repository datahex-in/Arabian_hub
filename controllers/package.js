const { default: mongoose } = require("mongoose");
const Package = require("../models/package");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW PACKAGE
// @route     POST /api/v1/package
// @access    protect
exports.createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(200).json({
      success: true,
      message: "Package created successfully",
      data: newPackage,
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

// @desc      GET ALL PACKAGE
// @route     GET /api/v1/package
// @access    public
exports.getPackage = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Package.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific package",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Package.countDocuments(),
      parseInt(skip) === 0 && Package.countDocuments(query),
      Package.find(query)
        .populate("destination")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all package`,
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

// @desc      UPDATE SPECIFIC PACKAGE
// @route     PUT /api/v1/package/:id
// @access    protect
exports.updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: package,
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

// @desc      DELETE SPECIFIC PACKAGE
// @route     DELETE /api/v1/package/:id
// @access    protect
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.query.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
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

// @desc      GET PACKAGE
// @route     GET /api/v1/package/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Package.find(
      {},
      { _id: 0, id: "$_id", value: "$packageName" }
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

// @desc      GET PACKAGE BY DESTINATION
// @route     GET /api/v1/package/get-package-by-destination
// @access    protect
exports.getPackageByDestination = async (req, res) => {
  try {
      if (!isValidObjectId(req.query.destination)) {
          return res.status(200).json([]);
      }
      const items = await Package.find({ destination: req.query.destination ?? "" }, { _id: 0, id: "$_id", value: "$title" }).populate("destination");
      res.status(200).json(items);
  } catch (err) {
      console.log(err);
      res.status(400).json({
          success: false,
          message: err,
      });
  }
};