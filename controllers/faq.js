const { default: mongoose } = require("mongoose");
const Faq = require("../models/faq");
const { errorLog } = require("../utils/errorLog");

// @desc      CREATE NEW FAQ
// @route     POST /api/v1/faq
// @access    protect
exports.createFaq = async (req, res) => {
  try {
    const newFaq = await Faq.create(req.body);
    res.status(200).json({
      success: true,
      message: "Faq created successfully",
      data: newFaq,
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

// @desc      GET ALL FAQ
// @route     GET /api/v1/faq
// @access    public
exports.getFaq = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Faq.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific faq",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, question: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Faq.countDocuments(),
      parseInt(skip) === 0 && Faq.countDocuments(query),
      Faq.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all faq`,
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

// @desc      UPDATE SPECIFIC FAQ
// @route     PUT /api/v1/faq/:id
// @access    protect
exports.updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "Faq not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faq updated successfully",
      data: faq,
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

// @desc      DELETE SPECIFIC FAQ
// @route     DELETE /api/v1/faq/:id
// @access    protect
exports.deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.query.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "Faq not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faq deleted successfully",
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
