const router = require("express").Router();
// Controllers
const {
  createActivity,
  getActivity,
  updateActivity,
  deleteActivity,
  select,
} = require("../controllers/activity");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/public/activity", ["icon", "image"]),
    getS3Middleware(["icon", "image"]),
    createActivity
   )
  .get(reqFilter, getActivity)
  .put(
    getUploadMiddleware("uploads/public/activity", ["icon", "image"]),
    getS3Middleware(["icon", "image"]),
    updateActivity
   )
  .delete(deleteActivity);

router.get("/select", reqFilter, select);

module.exports = router;
