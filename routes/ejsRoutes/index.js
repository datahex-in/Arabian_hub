var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
/* GET home page. */

router.get("/", async function (req, res, next) {
  const aboutdata = await about.findOne();
  res.render("index", { title: "Express", aboutdata });
});

module.exports = router;
