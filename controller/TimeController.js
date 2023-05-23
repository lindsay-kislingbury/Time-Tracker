const mongoose = require('mongoose');
const User = require('../models/User');
const date = require('date-and-time');

const stamp = async (req, res) => {
   console.log(req.body);
   const {startTime, stopTime, title, category} = req.body;
   let start = new Date(startTime);
   let end = new Date(stopTime);
   console.log("start time: ", start);
   console.log("end time: ", end);
   let elapsedTime = date.subtract(end, start).toSeconds();
   console.log("elapsed time: ", elapsedTime);
   let formattedDate = date.format(start, 'ddd MM/DD/YYYY');

   let timestamp = {
      title: title,
      category: category,
      date: formattedDate,
      elapsedTime: elapsedTime
   }
   
   let user = await User.findById(req.user.id);
   user.timestamps.push(timestamp);
   await user.save();
};

module.exports = stamp;