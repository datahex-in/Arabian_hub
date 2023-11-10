const { default: mongoose } = require("mongoose");
const Destination = require("../models/destination");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW DESTINATION
// @route     POST /api/v1/destination
// @access    protect
exports.createDestination = async (req, res) => {
  try {
    const newDestination = await Destination.create(req.body);
    res.status(200).json({
      success: true,
      message: "Destination created successfully",
      data: newDestination,
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

// @desc      GET ALL DESTINATION
// @route     GET /api/v1/destination
// @access    public
exports.getDestination = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Destination.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific destination",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Destination.countDocuments(),
      parseInt(skip) === 0 && Destination.countDocuments(query),
      Destination.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all destination`,
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

// @desc      UPDATE SPECIFIC DESTINATION
// @route     PUT /api/v1/destination/:id
// @access    protect
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination,
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

// @desc      DELETE SPECIFIC DESTINATION
// @route     DELETE /api/v1/destination/:id
// @access    protect
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.query.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
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

// @desc      GET DESTINATION
// @route     GET /api/v1/destination/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Destination.find(
      {},
      { _id: 0, id: "$_id", value: "$destination" }
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
