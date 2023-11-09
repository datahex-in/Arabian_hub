const router = require("express").Router();
// Controllers
const {
  createFaq,
  getFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faq");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createFaq)
  .get(reqFilter, getFaq)
  .put(updateFaq)
  .delete(deleteFaq);

module.exports = router;
