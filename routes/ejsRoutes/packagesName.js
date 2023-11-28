var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
const package = require("../../models/package");
const faq = require("../../models/faq");
const TourPlan = require("../../models/tourPlan");
/* GET home page. */
router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  const packages = await package.find();
  const packageData = await package.findById(id);
  console.log("datas", packageData);
  const faqData = await faq.find();
  const TourPlanData = await TourPlan.find();
  const aboutData = await about.findOne();
  res.render("packagesName", {
    title: "Express",
    packageData,
    faqData,
    TourPlanData,
    packages,
    aboutData,
  });
});

module.exports = router;
