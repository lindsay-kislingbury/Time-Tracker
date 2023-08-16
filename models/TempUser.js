const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const TempUserSchema = new Schema(
    {
        username: String,
        name: String,
        password: String,
        timestamps: [{
            title: String,
            project: String,
            tags: [String],
            date: Date,
            elapsedTime: Number,
        }],
        createdAt: { type: Date, expires: '2m', default: Date.now }
    },
    {
        collection: 'tempUsers'
    }
);


module.exports = mongoose.model("tempUser", TempUserSchema);