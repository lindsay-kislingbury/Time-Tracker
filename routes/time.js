const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));

const {stamp,remove,edit,updateDivContent} = require("../controller/TimeController");

router.post('/stamp', stamp);
router.post('/remove', remove);
router.post('/edit', edit);
router.all('/update', updateDivContent);


module.exports = router;