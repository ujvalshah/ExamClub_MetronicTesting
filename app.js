require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require("express");
const socketio = require("socket.io");
const app = express();
const fs = require('fs');
const server = http.createServer(app);
const io = socketio(server);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require('connect-flash');
const XLSX = require('xlsx');

//----------------------------------------------------------------------------//
//----------------------------------Require Models----------------------------//
//----------------------------------------------------------------------------//
const Download = require("./models/download.js");
const Video = require("./models/video.js");
// const seedDB = require("./seed.js");
const User = require("./models/user.js");
const Teacher = require("./models/teacher.js");
const Exam = require("./models/exam.js");
const Subscriber = require("./models/subscribers.js");
const Inquiry = require("./models/inquiry.js");
const Batchupload = require("./models/batchupload.js");
const Notification = require("./models/notifications.js");
const Notificationcopy = require("./models/notificationscopy.js");
const Temp = require("./models/temp.js");

//----------------------------------------------------------------------------//
//-------------------------------Route Of Application-------------------------//
//----------------------------------------------------------------------------//
const indexRoutes = require("./routes/index.js");
const userRoutes = require("./routes/user.js");
const downloadRoutes = require("./routes/downloads.js");
const videoRoutes = require("./routes/video.js");
const apiRoute = require("./routes/api.js");
const batchRoute = require("./routes/batch.js");
const processRoute = require("./routes/process.js");
const middleware = require("./middleware");
const { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin } = middleware;

mongoose.set('debug', true);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/examclub"    
mongoose.connect(url, {useNewUrlParser: true});
// mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.Promise = Promise;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public2"));
app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static(__dirname + "/uploads"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(flash());

// seedDB();

//----------------------------------------------------------------------------//
//------------------------------Passport Configuration------------------------//
//----------------------------------------------------------------------------//

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//----------------------------------------------------------------------------//
//----------------------------------Local Variables---------------------------//
//----------------------------------------------------------------------------//

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.warning = req.flash("warning");
    res.locals.emailVerification = req.flash("emailVerification");
    res.locals.currenthost = req.get('host');
    res.locals.currentprotocol = req.protocol;
    next();
});


//----------------------------------------------------------------------------//
//---------------------------------Requiring Routes---------------------------//
//----------------------------------------------------------------------------//

if(process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else
        next()
    })
  }
  
app.use(indexRoutes);
app.use(userRoutes);
app.use(downloadRoutes);
app.use(videoRoutes);
app.use(apiRoute);
app.use(batchRoute);
app.use(processRoute);


//----------------------------------------------------------------------------//
//-----------------------------------Sockets Routes---------------------------//
//----------------------------------------------------------------------------//
// var workbook = XLSX.readFile('C:/Users/ujval/Desktop/Book5.xlsx');
// var sheet_name_list = workbook.SheetNames;
// console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
// var uploadData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

// console.log('uploadData[0].exam');    
// console.log(uploadData[0].exam);
// var array = uploadData[0].exam.split(',');
// var array2 = uploadData[1].exam.split(',');
// console.log('array');
// console.log(array);
// console.log('array2');
// console.log(array2);
// console.log('uploadData.length');    
// console.log(uploadData.length);


// io.on('connection', (socket) => {
//     console.log('New WebSocket Connection');

    // socket.emit('notification', count, function (data){
    //     console.log(data);
    //     let messageDetails = {message:data}; 
    //     // let messageDetails = {message:data.message, uploader:data.uploader, author: data.author, date:data.author}; 
    //     Notification.create(messageDetails, (err,success)=>{
    //         if(err){console.log(err);}
    //         console.log("Successfully added Notification");
    //     });

    // });

// })
//----------------------------------------------------------------------------//
//-------------------------Notification Route(GET)----------------------------//
//----------------------------------------------------------------------------//

// app.get('/notification', async (req, res) => {
//     try {
//             Notification.find({}).sort({ createdAt: 1 }).exec((err, foundNotification) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 console.log(foundNotification)
//                 res.send(foundNotification);
//             });
//         } else {
//             res.send('');
//         }
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(500);
//     }
// })


app.get('/notification', async (req, res) => {
    try {
        if (req.user) {
            let user = await User.findById(req.user._id).populate({
                path: 'notifications',
                options: { sort: { "_id": 1 } }
            }).exec();
            let allNotifications = await user.notifications;
            // console.log(user);
            // console.log('------------')
            // console.log(allNotifications);
            // console.log('------------')
            res.send(allNotifications);
    }
} catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})
//--------------------------GET ALL Notification--------------------------//
app.get('/notification/all', async (req, res) => {
    try {
        if (req.user) {
            let notification = await Notification.find({}).sort({createdAt:1}).exec();
            res.send(notification);
    } else if(!req.user){
        res.send('You need to be signed in to view the notifications!');
    }
} catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
})



//----------------------------------------------------------------------------//
//--------------------------Notification Route(Post)--------------------------//
//----------------------------------------------------------------------------//

// app.post('/notification', async (req, res) => {
//     console.log(req.body);
//     console.log(req.body.message);
//     console.log(req.body.exam);
//     console.log(req.body.notificationExamData);
//     console.log("------------------");
//     try {

//         let notificationData = { message: req.body.message, author: { id: req.user._id, username: req.user.username }, exam: req.body.exam }
//         Notification.create(notificationData, (err, newNotification) => {
//             if (err) {
//                 console.log(err);
//             };
//             console.log("Successfully added the notification", newNotification);
//             // io.emit('notification', newNotification);

//             res.send(newNotification);
//         });
//     } catch (err) {
//         req.flash('error', err.message);
//         res.redirect('back');
//     }

// })

// TEMPORARY
// app.post('/notification', async (req, res) => {
//     console.log(req.body);
//     console.log(req.body.message);
//     console.log(req.body.exam);
//     console.log(req.body.notificationExamData);
//     console.log("------------------");
//     try {
//         let user = await User.findById(req.user._id).populate('followers').exec();
//         if(!user){req.flash('error', "You need to be signed in.")};
//         // console.log('********USER******');  
//         // console.log(user);
//         // console.log('******************');  
//         let notificationData = { message: req.body.message, author: { id: req.user._id, username: req.user.username }, exam: req.body.exam }
        
//         // console.log('********NOTIFICATIONDATA******');
//         // console.log(notificationData);
//         // console.log('**************');
//         let notificationNew = await Notification.create(notificationData);
//         // console.log('*****NOTIFICATION*********');
//         // console.log(notificationNew);
//         // console.log('******USER.FOLLOWERS********');
//         // console.log(user.followers);
//         for(const follower of user.followers){
//             let notification = await Notificationcopy.create(notificationData);
//             follower.notifications.push(notification);
//             follower.save();
//             console.log(follower);
//         }
//         req.flash('error','Notification successfully created!');
//             // io.emit('notification', newNotification);
//         // res.send(newNotification);
//         res.redirect(`/user/${currentUser._id}/dashboard`);
//         } catch (err) {
//         req.flash('error', err.message);
//         res.redirect('back');
//     }

// })

//----------------------------------------------------------------------------//
//---------------------------------Server Message-----------------------------//
//----------------------------------------------------------------------------//
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log(`ExamClub is live on ${port} !`);
});


// app.listen(process.env.PORT, process.env.IP, function (){
//    console.log("Exam server is live!");
// });




// var server = app.listen(8081, function () {
//     var host = server.address().address
//     var port = server.address().port