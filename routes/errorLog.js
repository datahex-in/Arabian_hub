const router = require("express").Router();
// controllers
const {
  addErrorLog,
  getErrorLog,
  updateErrorLog,
  deleteErrorLog,
  select,
} = require("../controllers/errorLog");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(addErrorLog)
  .get(reqFilter, getErrorLog)
  .put(updateErrorLog)
  .delete(deleteErrorLog);

router.get("/select", reqFilter, select);

module.exports = router;
