const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String,require:true, unique:true},
    password:{type:String, require:true, unique:true}
});

const User = mongoose.model("User", UserSchema);


const conversationSchema = new mongoose.Schema({
    type:{type:String, require:true},//message, notifications
    user:{type:String},
    message:{type:String}
})

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = {User,Conversation};