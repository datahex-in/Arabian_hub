var express = require("express");
var router = express.Router();
const about = require("../../models/aboutUs");
const faq = require("../../models/faq");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const aboutData = await about.findOne();
  const faqData = await faq.find();
  res.render("question", { title: "Express", aboutData, faqData  });
});

module.exports = router;
