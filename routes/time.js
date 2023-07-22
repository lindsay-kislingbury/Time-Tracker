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
    getOneEntry,
    getAllEntries,
} = require("../controller/TimeController");

router.post('/create', createStamp);
router.post('/remove', removeStamp);
router.post('/edit', editStamp);
router.all('/update', updateDivContent);
router.get('/loadAllTags', getAllTags);
router.post('/getOneEntry', getOneEntry);
router.get('/getAllEntries', getAllEntries);

module.exports = router;