const router = require("express").Router();
// Controllers
const {
  createPackage,
  getPackage,
  updatePackage,
  deletePackage,
  select,
  getPackageByDestination,
} = require("../controllers/package");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createPackage)
  .get(reqFilter, getPackage)
  .put(updatePackage)
  .delete(deletePackage);

router.get("/select", reqFilter, select);
router.get("/get-package-by-destination", reqFilter, getPackageByDestination);

module.exports = router;
