const mongoose = require('mongoose')

let msgSchema = mongoose.Schema({
    self_Id:{type:String},
    friend_Id:{type:String},
    chat_History:{type:[{
    messageText:{type:String},
    sender_Id:{type:String},
    reciever_Id:{type:String},
    sent_At:{type:String},
    }]},
    started_Chat_On:{type: String}
})

module.exports = {
    Msg : mongoose.model('Msg', msgSchema)
};