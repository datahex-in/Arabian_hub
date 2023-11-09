const router = require("express").Router();
// Controllers
const {
  createTourPlan,
  getTourPlan,
  updateTourPlan,
  deleteTourPlan,
  select,
  getTourPlanByPackage,
} = require("../controllers/tourPlan");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createTourPlan)
  .get(reqFilter, getTourPlan)
  .put(updateTourPlan)
  .delete(deleteTourPlan);

router.get("/select", reqFilter, select);
router.get("/get-tourplan-by-package", reqFilter, getTourPlanByPackage);

module.exports = router;
