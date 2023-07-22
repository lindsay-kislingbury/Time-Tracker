const mongoose = require('mongoose');
const User = require('../models/User');

const createStamp = async (req, res) => {
   try{
      const {title, tags, date, elapsedTime} = req.body;
      const timestamp = {
         title: title,
         tags: tags,
         date: date,
         elapsedTime: elapsedTime,
      };
      const user = await User.findById(req.user.id);
      user.timestamps.push(timestamp);
      await user.save();
      res.status(200).json({message: "Stamp created successfully"});
   } catch (error) {
      console.log(error);
      res.status(500).json({message: "Error creating stamp"})
   }
};

const removeStamp = async(req, res) => {
   try{
      const deleteId = mongoose.Types.ObjectId(req.body.deleteId);
      await User.updateOne({ _id: req.user.id }, {
         $pull: {timestamps: {_id: deleteId}}
      });
      res.status(200).json({message: "Stamp removed successfully"});
   } catch(error){
      console.log(error);
      res.status(500).json({message: "Error removing stamp"})
   }
}

const editStamp = async(req,res) => {
   try{
      const editId = mongoose.Types.ObjectId(req.body.stampId);
      const timestamp = {
         title: req.body.title,
         tags: req.body.tags,
         date: req.body.date,
         elapsedTime: req.body.time,
      }
      await User.findOneAndUpdate({_id: req.user.id, 'timestamps._id': editId},
         {$set: {'timestamps.$': timestamp}}
      );
      res.status(200).json({message: "Stamp edited successfully"});
   } catch(error) {
      console.log(error);
      res.status(500).json({message: "Error editing stamp"})
   }
}

const updateDivContent = async(req, res) => {
   let user = await User.findById(req.user.id);
   res.send(user);
}

const getAllTags = async(req,res) => {
   try{
      const user = await User.findById(req.user.id);
      const allTags = user.timestamps.flatMap(timestamp => {
         return timestamp.tags.flatMap(tag => {
            return tag;
         })
      })
      const tags = [...new Set(allTags)];
      res.send(tags);
   } catch(error) {
      console.log(error);
      res.status(500).json({message: "Error getting all tags for user"})
   }
}

const getOneEntry = async(req,res) => {
   try{
      const user = await User.findById(req.user.id);
      const timestamp = user.timestamps.find(stamp => {
         return stamp._id.equals(req.body.stampId)
      });
      res.send({
         date: timestamp.date,
         title: timestamp.title,
         time: timestamp.elapsedTime,
         tags: timestamp.tags, 
      });
   } catch(error) {
      res.status(500).json({message: "Error getting data for one timestamp"})
   }
}

const getAllEntries = async(req, res) => {
   try{
      const user = await User.findById(req.user.id);
      res.send({timestamps: user.timestamps});
   }
   catch(error){
      res.status(500).json({message: "Error getting all entries"});
   }
}

module.exports = {
   createStamp,
   removeStamp,
   editStamp,
   updateDivContent,
   getAllTags,
   getOneEntry,
   getAllEntries,
};