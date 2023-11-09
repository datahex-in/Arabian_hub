const { default: mongoose } = require("mongoose");
const Enquiry = require("../models/enquiry");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW ENQUIRY
// @route     POST /api/v1/enquiry
// @access    protect
exports.createEnquiry = async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);
    res.status(200).json({
      success: true,
      message: "Enquiry created successfully",
      data: newEnquiry,
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

// @desc      GET ALL ENQUIRY
// @route     GET /api/v1/enquiry
// @access    public
exports.getEnquiry = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Enquiry.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific enquiry",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Enquiry.countDocuments(),
      parseInt(skip) === 0 && Enquiry.countDocuments(query),
      Enquiry.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all enquiry`,
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

// @desc      UPDATE SPECIFIC ENQUIRY
// @route     PUT /api/v1/enquiry/:id
// @access    protect
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      data: enquiry,
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

// @desc      DELETE SPECIFIC ENQUIRY
// @route     DELETE /api/v1/enquiry/:id
// @access    protect
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.query.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
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
