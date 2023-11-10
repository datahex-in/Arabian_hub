const router = require("express").Router();
// controllers
const {
  addUser,
  getUser,
  updateUser,
  updateUserField,
  deleteUser,
  filterUser,
  select,
  updatePassword,
  deletedUser,
  restoreUser,
  selectDietitian,
  branchDietitian,
} = require("../controllers/user");
// middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
//image handling
const { getS3Middleware } = require("../middleware/s3client");

const getUploadMiddleware = require("../middleware/upload");
// file upload settings

router
  .route("/")
  .post(
    protect,
    getUploadMiddleware("public/dfms/uploads/user", [
      "userImage",
      "identityDocument",
    ]),
    getS3Middleware(["userImage", "identityDocument"]),
    addUser
  )
  .get(reqFilter, protect, getUser)
  .put(
    protect,
    getUploadMiddleware("public/dfms/uploads/user", [
      "userImage",
      "identityDocument",
    ]),
    getS3Middleware(["userImage", "identityDocument"]),
    updateUser
  )
  .delete(protect, deleteUser);

router.patch("/update-user-field", updateUserField);
router.get("/filter-user", filterUser);
router.get("/select", reqFilter, protect, select);
router.get("/branch-dietitian", reqFilter, protect, branchDietitian);
router.get("/select-dietitian", reqFilter, protect, selectDietitian);
router.post("/update-passoword", protect, updatePassword);

router
  .route("/user-deletion")
  .get(reqFilter, protect, deletedUser)
  .put(reqFilter, protect, restoreUser);

module.exports = router;
