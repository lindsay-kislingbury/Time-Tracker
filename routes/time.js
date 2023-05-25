const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));

const stamp = require("../controller/TimeController");


router.post('/stamp', stamp);

module.exports = router;