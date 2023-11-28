var express = require("express");
var router = express.Router();
const package = require("../../models/package");
const faq = require("../../models/faq");
const about = require("../../models/aboutUs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const packageData = await package.find();
  const aboutData = await about.findOne();
  const faqData = await faq.find();
  res.render("atvtours", { title: "Express", faqData, packageData, aboutData });
});

module.exports = router;
