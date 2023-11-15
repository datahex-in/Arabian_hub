var express = require("express");
var router = express.Router();
const package = require("../../models/package");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const packageData = await package.find();
  res.render("packagesName", { title: "Express", packageData });
});

module.exports = router;
