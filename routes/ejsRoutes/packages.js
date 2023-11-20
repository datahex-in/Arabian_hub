var express = require("express");
var router = express.Router();
const package = require("../../models/package");
const faq = require("../../models/faq");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const packageData = await package.find();
  const faqData = await faq.find();
  res.render("packages", { title: "Express", packageData, faqData });
  console.log("faqqqs", packageData);
});

module.exports = router;
