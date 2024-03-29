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
    getAllTagsAndProjects,
    getOneEntry,
    getAllEntries,
} = require("../controller/TimeController");

router.post('/create', createStamp);
router.post('/remove', removeStamp);
router.post('/edit', editStamp);
router.get('/update', updateDivContent);
router.get('/loadAllTagsandProjects', getAllTagsAndProjects);
router.post('/getOneEntry', getOneEntry);
router.get('/getAllEntries', getAllEntries);

module.exports = router;