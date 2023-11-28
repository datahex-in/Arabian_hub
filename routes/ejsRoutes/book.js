var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const aboutData = await about.findOne();
  res.render("book", { title: "Express", aboutData });
});

module.exports = router;
