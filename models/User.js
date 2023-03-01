const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: String,
        name: String,
        password: String,
        timestamps: [ {
            title: String,
            category: String,
            start: Date,
            end: Date,
        }],
    },
    {
        collection: 'users'
    }
);

UserSchema.pre("save", async function(next) {
    const user = this;
    try{
        if(!user.isModified("password")) next();
        let hash = await bcrypt.hash(user.password, 13);
        user.password = hash;
        next();
    }
    catch(error) {
        console.error(error);
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(password) {
    try{
        let result = await bcrypt.compare(password, this.password);
        console.log("result: ", result);
        return result;
    }
    catch (error) {
        console.error(error);
        return false;
    }
};

UserSchema.methods.addTimestamp = async function(title, category, start, end){
    const user = this;
    user.timestamps.push({
        title: title,
        category: category,
        start: start,
        end: end,
    })
}

module.exports = mongoose.model("user", UserSchema);