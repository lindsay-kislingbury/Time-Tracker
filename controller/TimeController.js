const mongoose = require('mongoose');
const User = require('../models/User');
const date = require('date-and-time');

const stamp = async (req, res) => {
   console.log(req.body);
   const {title, tags, date, elapsedTime} = req.body;
   console.log("elapsed time: ", elapsedTime);
   console.log("date:", date);

   let timestamp = {
      title: title,
      tags: tags,
      date: date,
      elapsedTime: elapsedTime
   }
   let user = await User.findById(req.user.id);
   user.timestamps.push(timestamp);
   await user.save();


   //refresh timesamp list
};

const remove = async(req, res) => {
   var deleteId = mongoose.Types.ObjectId(req.body.deleteId);
   await User.updateOne({ _id: req.user.id }, {
      $pull: {timestamps: {_id: deleteId}}
   });
   console.log("deleted: ", deleteId);
}



module.exports = {
   stamp,
   remove
};