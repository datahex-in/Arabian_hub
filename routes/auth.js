const router = require("express").Router();
//
const {
  login,
  getMe,
  register,
  updatePassword,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);

router.get("/get-me", protect, getMe);
router.post("/update-passoword", protect, updatePassword);

module.exports = router;
