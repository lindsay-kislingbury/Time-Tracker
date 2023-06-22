const mongoose = require('mongoose');
const User = require('../models/User');
const date = require('date-and-time');

const stamp = async (req, res) => {
   const {title, tags, date, elapsedTime} = req.body;
   let timestamp = {
      title: title,
      tags: tags,
      date: date,
      elapsedTime: elapsedTime,
   }
   let user = await User.findById(req.user.id);
   user.timestamps.push(timestamp);
   await user.save();
};

const remove = async(req, res) => {
   var deleteId = mongoose.Types.ObjectId(req.body.deleteId);
   await User.updateOne({ _id: req.user.id }, {
      $pull: {timestamps: {_id: deleteId}}
   });
}

const edit = async(req,res) => {
   var editValue = mongoose.Types.ObjectId(req.body.editValue);
   var editId = mongoose.Types.ObjectId(req.body.editId);
   await User.findOneAndUpdate({_id: req.user.id},
      {$set: {"timestamps.$[stamp].value": editValue}},
      {arrayFilters: [{"stamp._id": editId}]}
   )
   console.log("edit value: ", req.body.editValue);
   console.log("edit ID: ", req.body.editId);
}

const updateDivContent = async(req, res) => {
   let user = await User.findById(req.user.id);
   res.send(user);
}


module.exports = {
   stamp,
   remove,
   edit,
   updateDivContent
};