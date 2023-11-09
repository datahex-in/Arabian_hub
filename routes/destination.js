const router = require("express").Router();
// Controllers
const {
  createDestination,
  getDestination,
  updateDestination,
  deleteDestination,
  select,
} = require("../controllers/destination");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/public/destination", ["thumbnailImage", "bannerImage"]),
    getS3Middleware(["thumbnailImage", "bannerImage"]),
    createDestination
    )
  .get(reqFilter, getDestination)
  .put(
    getUploadMiddleware("uploads/public/destination", ["thumbnailImage", "bannerImage"]),
    getS3Middleware(["thumbnailImage", "bannerImage"]),
    updateDestination
   )
  .delete(deleteDestination);

router.get("/select", reqFilter, select);

module.exports = router;
