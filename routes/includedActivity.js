const router = require("express").Router();
// Controllers
const {
  createIncludedActivity,
  getIncludedActivity,
  updateIncludedActivity,
  deleteIncludedActivity,
  getIncludedActivityByPackage,
} = require("../controllers/includedActivity");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
router
  .route("/")
  .post(createIncludedActivity)
  .get(reqFilter, getIncludedActivity)
  .put(updateIncludedActivity)
  .delete(deleteIncludedActivity);

router.get("/get-includedactivity-by-package", reqFilter, getIncludedActivityByPackage);

module.exports = router;
