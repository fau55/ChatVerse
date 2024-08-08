// Importing required modules
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { User } = require('./models/user');
const { Msg } = require('./models/messages')
var cors = require('cors')
const express = require('express');
const app = express();
app.use(cors());
mongoose.connect('mongodb+srv://farahhashmi13sk:sag1yluM8pUlafjC@cluster0.vlsff.mongodb.net/chatApp?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('connected to database ');
}).catch(() => {
    console.log('connection failed!!');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + "  " + strTime;
}

// endpoint for registering the user
app.post('/chatApp/register', async (req, res, next) => {
    let userToAdd = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        createdOn: new Date(),
        email: req.body.email,
        profilePhoto: req.body.profilePhoto,
    })

    try {
        const userNameExist = await User.find({ email: req.body.email });
        if (userNameExist.length === 0) {
            await userToAdd.save();
            res.status(200).json({
                Message: 'User Added Successfully',
                isUserExist: false
            });
        } else {
            res.status(200).json({
                Message: 'Email Id Already Exists',
                user_name: req.body.email,
                isUserExist: true
            });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ Message: 'Internal Server Error' });
    }
});

// endpoint for getting all users 
app.get('/chatApp/getAllUsers', (req, res, next) => {
    User.find().then((document) => {
        res.status(200).json({
            Message: 'All users Fetched Successfully',
            User_list: document
        })
    })
})

// login api to see if user exists aur not
app.post('/chatApp/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).json({ Message: 'User not Exist. Try Registering.', userIsExists: false });
        } else if (user.password !== req.body.password) {
            return res.status(200).json({ Message: 'Incorrect password', userIsExists: false });
        } else {
            user.isActive = true;
            // Save the updated user object
            await user.save();
            return res.status(200).json({ Message: 'User Exists', userIsExists: true, userId: user._id });
        }
    } catch (error) {
        return res.status(500).json({ Message: 'Internal Server Error' });
    }
});
// changing isActive= true to isActive = False 
app.post('/chatApp/logout', async (req, res, next) => {
    try {
        const updatedUser = await User.findOne({ _id: req.body._id });
        if (!updatedUser) {
            return res.status(404).json({ Message: 'User not found' });
        }
        let date = new Date()
        let currentDate = formatDate(date)

        updatedUser.isActive = false;
        updatedUser.lastOnline = currentDate;
        await updatedUser.save(); // Wait for the save operation to complete

        return res.status(200).json({ Message: 'User logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Message: 'Internal Server Error' });
    }
});


// checking if chat history exist or not(if not then creating it)
app.post('/chatApp/create/chatHistory', (req, res, next) => {
    // Searching for existing chat history
    Msg.find({
        $or: [
            { self_Id: req.body.self_Id, friend_Id: req.body.friend_Id },
            { self_Id: req.body.friend_Id, friend_Id: req.body.self_Id }
        ]
    }).then((document) => {
        if (document.length > 0) {
            // If chat history already exists, respond with existing chat ID
            res.status(200).json({
                Message: 'Chat already Exist',
                chat: { _id: document[0]._id }
            });
        } else {
            // If no chat history exists, create a new chat history document
            let newChat = new Msg({
                self_Id: req.body.self_Id,
                friend_Id: req.body.friend_Id,
                chat_History: [],
                started_Chat_On: new Date()
            });
            // Save the new chat history document
            newChat.save().then((document) => {
                res.status(200).json({
                    Message: 'Chat History Created',
                    chat: document
                });
            }).catch((error) => {
                res.status(500).json({
                    Message: 'Error creating chat history'
                });
            });
        }
    });
});

// update Chat History
app.post('/chatApp/update/chatHistory/:id', (req, res, next) => {
    Msg.find({ _id: req.params.id }).then((documents) => {
        if (!documents.length) {
            return res.status(404).json({ message: "Chat history not found" });
        }
        // Updating chat history
        documents[0].chat_History.push(req.body.chat_History);
        // Saving the updated document
        documents[0].chat_History.sent_At = new Date();
        documents[0].save().then(() => {
            res.status(200).json({ message: "Chat history updated" });
        }).catch((error) => {
            res.status(500).json({ message: "Failed to update chat history" });
        });
    }).catch((error) => {
        res.status(500).json({ message: "Error finding chat history" });
    });
});


// getting message id 
app.post('/chatApp/get/chat-id', (req, res, next) => {
    Msg.findOne({ friend_Id: req.body.friend_Id, self_Id: req.body.self_Id })
        .then((document) => {
            if (document) {
                // If chat history already exists, respond with existing chat ID
                const chatId = document._id;
                res.status(200).json({
                    Message: 'Chat already Exist',
                    Chat_id: chatId
                });
            }
            else {
                res.status(200).json({
                    Message: 'Chat not found'
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        });
});
// getting All the chats with user through chat id
app.post('/chatApp/get/all-chats', (req, res, next) => {
    Msg.find({ _id: req.body._id }).then((document) => {
        res.status(200).json({
            Message: 'Chats fetched Successfully',
            chats: document
        })
    })
})

app.post('/api/chatApp/getUser/byId', (req, res, next) => {
    User.find({ _id: req.body._id }).then((document) => {
        res.status(200).json({
            Message: 'Successful in getting user by id',
            userInfo: document
        });
    });
});
// endPoint to upload user profile 
app.post('/api/chatApp/user/uploadpic/:id', async (req, res, next) => {
    await User.findOneAndUpdate(
        { _id: req.params.id },
        { profilePhoto: req.body.profilePhoto }).then((doc) => {
            res.status(200).json({
                Messgae: 'uploade Successfull'
            })
        })
});

// endPoint to upload user about us 
app.post('/api/chatApp/user/upload-about-us/:id', async (req, res, next) => {
    await User.findOneAndUpdate(
        { _id: req.params.id },
        { aboutAs: req.body.aboutAs }
    ).then(() => {
        res.status(200).json({
            Message: 'Status Updated Successfully'
        })
    })
})
// endPoint to upload user Name 
app.post('/api/chatApp/user/upload-name/:id', async (req, res, next) => {
    await User.findOneAndUpdate(
        { _id: req.params.id },
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }

    ).then(() => {
        res.status(200).json({
            Message: 'Name Updated Successfully'
        })
    })
})



module.exports = app;