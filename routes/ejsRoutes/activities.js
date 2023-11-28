var express = require("express");
var router = express.Router();
const faq = require("../../models/faq");
const about = require("../../models/aboutUs");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const faqData = await faq.find();
  const aboutData = await about.findOne();
  res.render("activities", { title: "Express", faqData, aboutData });
});

module.exports = router;
