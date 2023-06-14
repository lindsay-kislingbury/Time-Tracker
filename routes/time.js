const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));

const {stamp,remove} = require("../controller/TimeController");

router.post('/stamp', stamp);
router.post('/remove', remove);

module.exports = router;