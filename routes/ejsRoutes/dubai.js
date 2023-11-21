var express = require("express");
var router = express.Router();
const faq = require("../../models/faq");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const faqData = await faq.find();
  res.render("dubai", { title: "Express", faqData });
});

module.exports = router;
