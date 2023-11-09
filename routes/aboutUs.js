const router = require("express").Router();
// Controllers
const {
  createAboutUs,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs,
  select,
} = require("../controllers/aboutUs");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAboutUs)
  .get(reqFilter, getAboutUs)
  .put(updateAboutUs)
  .delete(deleteAboutUs);

router.get("/select", reqFilter, select);

module.exports = router;
