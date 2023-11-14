var express = require("express");
var router = express.Router();
const destination = require("../../models/destination");
/* GET home page. */
router.get("/", async function (req, res, next) {
  const destinationData = await destination.findOne();
  res.render("destination", { title: "Express", destinationData });
});

module.exports = router;
