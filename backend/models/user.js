const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    profilePhoto: {type: String, default: 'profilePic.jpg'},
    firstName : {type: String, require : true},
    lastName : {type: String, require : true},
    password : {type: String, require : true},
    email : {type: String, require : true},
    createdOn : {type: String},
    isActive : {type: Boolean, default: false},
    onlineAt : {type: String},
    lastOnline : {type: String},
    aboutAs : {type: String, default: "hey there I'am using ChatVerse"}
    
})

module.exports = {
    User : mongoose.model('User', userSchema)
};