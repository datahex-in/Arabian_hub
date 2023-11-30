var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
const package = require("../../models/package");
const faq = require("../../models/faq");
const activity = require("../../models/activity");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const packageData = await package.find();
  const aboutData = await about.findOne();
  const faqData = await faq.find();
  const activityData = await activity.find();
  res.render("sandtours", {
    title: "Express",
    packageData,
    activityData,
    faqData,
    aboutData,
  });
});

module.exports = router;
