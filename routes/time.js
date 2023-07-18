const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(express.static(__dirname + '/public'));
const {
    createStamp,
    removeStamp,
    editStamp,
    updateDivContent,
    getAllTags,
    getTimestampdata,
} = require("../controller/TimeController");

router.post('/create', createStamp);
router.post('/remove', removeStamp);
router.post('/edit', editStamp);
router.all('/update', updateDivContent);
router.all('/loadAllTags', getAllTags);
router.all('/getOneStampTags', getTimestampdata);

module.exports = router;