const router = require("express").Router();
// Controllers
const {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  filterAppointment,
  activeAdmission,
  activeAppointments,
  admissionHistory,
  isScheduled,
  createAdmisioHistory,
  updateAdmissionHistory,
  allAdmissionHistory,
  // updateDischarge,
} = require("../controllers/appointment");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createAppointment)
  .get(reqFilter, protect, getAppointment)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.get("/filter", protect, filterAppointment);
router
  .route("/active")
  .post(createAppointment)
  .get(protect, reqFilter, activeAdmission)
  .put(updateAppointment)
  .delete(deleteAppointment);

router
  .route("/admission-history")
  .post(protect, createAdmisioHistory)
  .get(protect, reqFilter, admissionHistory)
  .put(updateAdmissionHistory)
  .delete(deleteAppointment);

router
  .route("/all-admission-history")
  .get(protect, reqFilter, allAdmissionHistory);

router
  .route("/active-appointments")
  .get(protect, reqFilter, activeAppointments)
  .post(protect, reqFilter, createAppointment);

router.route("is-schedule").get(protect, reqFilter, isScheduled);

module.exports = router;
