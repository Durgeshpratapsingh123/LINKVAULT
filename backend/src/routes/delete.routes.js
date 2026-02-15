const express = require("express");
const deletePaste = require("../controllers/delete.controller");

const router = express.Router();

router.delete("/delete/:id", deletePaste);

module.exports = router;
