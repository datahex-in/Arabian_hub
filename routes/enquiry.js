const router = require("express").Router();
// Controllers
const {
  createEnquiry,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiry");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createEnquiry)
  .get(reqFilter, getEnquiry)
  .put(updateEnquiry)
  .delete(deleteEnquiry);

module.exports = router;
