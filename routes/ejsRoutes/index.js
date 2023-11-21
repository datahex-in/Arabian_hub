var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
const destination = require("../../models/destination");
const package = require("../../models/package");
const faq = require("../../models/faq");
/* GET home page. */

router.get("/", async function (req, res, next) {
  const aboutData = await about.findOne();
  const destinationData = await destination.findOne();
  const packageData = await package.findOne();
  const faqData = await faq.find();
  res.render("index", {
    title: "Express",
    aboutData,
    destinationData,
    packageData,
    faqData,
  });
});

module.exports = router;
