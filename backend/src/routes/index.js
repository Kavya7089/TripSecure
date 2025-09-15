const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/tourists", require("./tourist"));
router.use("/trips", require("./trip"));
router.use("/alerts", require("./alert"));
router.use("/feedback", require("./feedback"));
router.use("/dashboard", require("./dashboard"));

module.exports = router;
