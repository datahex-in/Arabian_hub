const router = require("express").Router();
const { getAddOnActivityByPackage } = require("../controllers/addOnActivity");
// Controllers
const {
  createIncludedActivity,
  getIncludedActivity,
  updateIncludedActivity,
  deleteIncludedActivity,
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

  router.get("/get-addonactivity-by-package", reqFilter, getAddOnActivityByPackage);

module.exports = router;
