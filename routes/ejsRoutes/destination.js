var express = require("express");
var router = express.Router();
const destination = require("../../models/destination");
const faq = require("../../models/faq");
const about = require("../../models/aboutUs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const destinationData = await destination.find();
  const aboutData = await about.findOne();
  const faqData = await faq.find();
  res.render("destination", {
    title: "Express",
    destinationData,
    faqData,
    aboutData,
  });
});

module.exports = router;
