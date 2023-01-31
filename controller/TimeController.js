const date = require('date-and-time');

const stamp = (req, res) => {
   const {startTime, stopTime} = req.body;
   console.log("req: ", req.body);
   start = new Date(startTime);
   stop = new Date(stopTime);

   //account for 2 second difference between function calls
   //in client side js
   let tempTime = date.addSeconds(stop, -2);
   stop = tempTime;

   let output = date.subtract(stop, start).toSeconds();

   console.log(output);
   
};

module.exports = stamp;