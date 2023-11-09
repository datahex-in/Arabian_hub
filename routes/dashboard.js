const router = require("express").Router();
//controllers
const {
  count,
  patientCount,
  countWithDate,
  newAppointments,
} = require("../controllers/dashboard");
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router.route("/").get(protect, reqFilter, count);
router.route("/dietitian").get(protect, reqFilter, patientCount);
router.route("/date-filter").get(protect, reqFilter, countWithDate);
router.route("/appointment").get(protect, reqFilter, newAppointments);

module.exports = router;
