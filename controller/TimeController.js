const mongoose = require('mongoose');
const date = require('date-and-time');
const User = require('../models/User');

const stamp = async (req, res) => {
   const {startTime, stopTime} = req.body;
   let start = new Date(startTime);
   let end = new Date(stopTime);

   console.log("start time: ", start);
   console.log("end time: ", end);

   
   let elapsedTime = date.subtract(end, start).toSeconds();
   
   console.log("elapsed time: ", elapsedTime);

   let timestamp = {
      title: "Temp title",
      category: "Temp Category",
      start: start,
      end: end,
   }

   console.log(mongoose.isValidObjectId(req.user.id));

   
   let user = await User.findById(req.user.id);
   
   user.timestamps.push(timestamp);
   await user.save();
   

   console.log("found user: ", user);
   

   

   //**working on getting this to work */
};

module.exports = stamp;