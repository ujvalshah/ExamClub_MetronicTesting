var express = require("express");
var router = express.Router();
var passport = require("passport");
const crypto = require("crypto");
const util = require('util');
var User = require("../models/user.js");
var Exam = require("../models/exam.js");
var Teacher = require("../models/teacher.js");
var Notification = require("../models/notifications.js");
var Subscriber = require("../models/subscribers.js");
const { sendPasswordResetMail, sendPasswordResetConfirmationMail, sendEmailVerificationMail } = require("../middleware/email.js");
const { isLoggedIn, isEmailVerified, isAdmin } = require("../middleware/index.js");
const io = require("../utils/sockets.js");
//----------------------------------------------------------------------------//
//--------------------------Index Route Of Application------------------------//
//----------------------------------------------------------------------------//
router.get("/", function (req, res) {
    res.redirect("/downloads");
    // res.render("index2", { page: "homepage", title: "Home" });
});


//----------------------------------------------------------------------------//
//--------------------------Registration Form Route---------------------------//
//----------------------------------------------------------------------------//

router.get("/register", async function (req, res) {
    let exams = await Exam.find({});
    req.flash("error");
    res.render("register", { page: 'register', exams });
})

//----------------------------------------------------------------------------//
//--------------------------Registration[POST] Route--------------------------//
//----------------------------------------------------------------------------//

router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        dob: req.body.user.dob,
        email: req.body.user.email,
        mobile: req.body.user.mobile,
        city: req.body.user.city,
        exam: req.body.user.exam,
        displayName: `${req.body.user.firstName} ${req.body.user.lastName}`
    });
    if (req.body.actype === "isStudent") {
        newUser.isStudent = true;
    } else if (req.body.actype === "isFaculty") {
        newUser.isFaculty = true;
    } else if (req.body.actype === "isAdmin") {
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, async function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }


        passport.authenticate("local")(req, res, async function () {
            try {
                const user = await User.findOne({ _id: req.user._id });
                console.log(user);
                const userEmail = user.email;
                const host = req.headers.host;
                const token = await crypto.randomBytes(20).toString('hex');
                console.log(token);
                if (!user) {
                    req.flash("error", "No account with that email.");
                    return res.redirect("/login");
                }
                user.emailverificationToken = token;
                user.emailVerificationexpiry = Date.now() + 3600000; //1hr
                await user.save();
                await sendEmailVerificationMail(userEmail, user.username, host, token);

                //TeacherA/c Validation
                if (req.user.isFaculty === true && req.user.isFacultyVerified === false) {
                    req.logout();
                    req.flash('warning', `Your faculty account needs to be approved by the admin before you can access it.
                    Usually it takes 2-3 hours to get approved. Please wait till then.
                    For any further enquiries email at caexamclub@gmail.com.
                    Also for account validation it is necessary that your Email Id ${userEmail} is validated.
                    Please check your email for our validation mail. Thanks`);
                    res.redirect('/login');
                } else {
                    req.flash("success", `An e-mail has been sent to verify ${userEmail}.`);
                    res.redirect("/downloads");
                };

            } catch (err) {
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("/downloads");
            }
        });
    });
});


// ----------------------------------------------------------------------------//
// -----------------------------Email Verification Route-----------------------//
// ----------------------------------------------------------------------------//

router.get("/email-verification", isLoggedIn, function (req, res) {
    res.render("index2", { page: 'email-verification', title: 'Email-verification' });
})
// router.get("/email-verification", isLoggedIn, function (req, res) {
//     res.render("index2_emailVerification", { page: 'email-verification', title: 'Email-verification' });
// })

router.put("/email-verification", isLoggedIn, async (req, res) => {
    try {
        var user = await User.findOne({ _id: req.user._id });
        var userEmail = user.email;
        var host = req.headers.host;
        var token = await crypto.randomBytes(20).toString('hex');
        if (!user) {
            req.flash("error", "No account with that email.");
            return res.redirect("/login");
        }
        user.emailverificationToken = token;
        user.emailVerificationexpiry = Date.now() + 3600000; //1hr
        await user.save();
        await sendEmailVerificationMail(userEmail, user.username, host, token);
        req.flash("success", `An e-mail has been sent to verify ${userEmail}.`);
        res.redirect("back");
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/");
    }
})


router.get("/email-verification/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            emailverificationToken: token,
            emailVerificationexpiry: { $gt: Date.now() }
        });
        if (!user) {
            req.flash("error", "User does not exist/The link must have expired. Please try again");
            return res.redirect("/email-verification");
        }
        user.emailVerified = true;
        user.emailverificationToken = null;
        user.emailVerificationexpiry = null;
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.flash('success', `Hi ${user.username}, your email id has been successfully verified.`)
        res.redirect("/");
    } catch (err) {
        req.flash("err", err.message);
        return res.redirect("back");
    }
});



//----------------------------------------------------------------------------//
//------------------------------------Login Route-----------------------------//
//----------------------------------------------------------------------------//

router.get("/login", function (req, res) {
    req.flash("error");
    res.render("login", { page: 'login', title: "Login" });
})


// ----------------------------------------------------------------------------//
// -----------------------------Faculty Verification Route---------------------//
// ----------------------------------------------------------------------------//
router.put('/facultyVerification/:id',  async function(req, res){
    
    let foundFaculty = await User.findById(req.params.id);

    let updateFaculty = await User.findByIdAndUpdate(req.params.id, {isFacultyVerified: true}, { new: true });
        console.log(updateFaculty);
        if(updateFaculty.isFaculty){
            let newTeacherData = {
                registeredUser: foundFaculty._id,
                username: foundFaculty.username,
            }
            let newTeacher = await Teacher.create(newTeacherData);
            console.log(newTeacher);
        }
    res.json("success!");
})


//----------------------------------------------------------------------------//
//-------------------------------Faculty Validation---------------------------//
//----------------------------------------------------------------------------//
router.get("/faculty-validation", async (req, res) => {
    if (req.user.isFaculty === true && req.user.isFacultyVerified === false) {
        req.logout();
        req.flash('warning', `Your faculty account needs to be approved by the admin before you can access it.
        Usually it takes 2-3 hours to get approved. Please wait till then.
        For any further enquiries email at caexamclub@gmail.com.`);
        res.redirect('/login');
    } else {
        res.redirect('/');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/faculty-validation',
    failureRedirect: '/login',
    failureFlash: true,
}));



//----------------------------------------------------------------------------//
//-----------------------------------Logout Route-----------------------------//
//----------------------------------------------------------------------------//

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/downloads");
})


//----------------------------------------------------------------------------//
//-------------------------------Forgot Password------------------------------//
//----------------------------------------------------------------------------//
router.get("/forgot-password", (req, res) => {
    res.render("forgot", {page: 'forgot-password', title: 'Forgot Password'});
});
// router.get("/forgot-password2", (req, res) => {
//     res.render("index2", {page: 'forgot-password', title: 'Forgot Password'});
// });


router.put("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const host = req.headers.host;
        const user = await User.findOne({ email: req.body.email });
        const token = await crypto.randomBytes(20).toString('hex');
        if (!user) {
            req.flash("error", "No account with that email.");
            return res.redirect("/forgot-password");
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; //1hr
        await user.save();
        await sendPasswordResetMail(email, user.username, host, token);
        if (req.xhr){
            res.json(`An e-mail has been sent to ${user.email} with further instructions. Please check your spam for the email as well.`)
        }
        req.flash("success", `An e-mail has been sent to ${user.email} with further instructions. Please check your spam for the email as well.`);
        res.redirect("back");
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/login");
    }
});


router.get("/reset/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            req.flash("error", "User does not exist/The link must have expired. Please try again");
            return res.redirect("/forgot-password");
        }
        res.render("reset", { token, title:'Reset Password', page:'reset-password' });
    } catch (err) {
        req.flash("err", err.message);
        return res.redirect("/forgot-password");
    }
});


router.put("/reset/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            req.flash("error", "User does not exist/The link must have expired. Please try again");
            return res.redirect("/forgot-password");
        }

        if (req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.flash("error", "Password do not match.");
            return res.redirect(`/reset/${token}`);
        }
        await sendPasswordResetConfirmationMail(user.email, user.username);
        req.flash("success", `Password successfully updated`);
        return res.redirect("/downloads");
    } catch (err) {
        console.log(err);
        req.flash("error", err);
        return res.redirect("/login");
    }
});
//----------------------------------------------------------------------------//

router.get("/metronic", (req, res) => {
    res.render("index2", { page: "metronic", title: "Home" });
})

router.post('/newsletter/subscription', async (req, res) => {
    var newSubscriber = new Subscriber({ email: req.body.subscriber });
    let subscriber = await Subscriber.create(newSubscriber);
    if (!subscriber) {
        console.log(error);
    }
    req.flash("success", "Email successfully added to the list! Thank You!");
    res.redirect("back");
})

//----------------------------------------------------------------------------//
//-------------------------------Change Password------------------------------//
//----------------------------------------------------------------------------//

router.put('/change-password/:id', isLoggedIn, async function(req,res){
   try{
       let user = await User.findById(req.params.id);
        if(!user){
           req.flash('error', "Error! Try again");
           return res.redirect('back'); 
        } 
        if (req.body.newpassword === req.body.confirm) {
            await user.setPassword(req.body.newpassword);
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.flash("error", "Password do not match.");
            return res.redirect(`back`);
        }
        await sendPasswordResetConfirmationMail(user.email, user.username);
        req.flash("success", `Password successfully changed`);
        return res.redirect("back");
   } catch(error){
       req.flash('error', "Error! Please try again!");
       res.redirect('back');
   }
})


//----------------------------------------------------------------------------//
//------------------------------Edit User Details-----------------------------//
//----------------------------------------------------------------------------//
router.get('/account-details/:id/edit', isLoggedIn, async (req, res) => {
    let user = await User.findById(req.user._id);
    let exams = await Exam.find({});
    res.render('index2', { page: 'account-details', title: 'Account Details', user,exams });
});

router.put('/account-details/:id', isLoggedIn, async(req,res)=>{
try{
    let updatedProfileItems = req.body.updateProfile;
    if( updatedProfileItems.email &&  updatedProfileItems.email === req.user.email){
        console.log('Email Id is the same!');
    }
    if( updatedProfileItems.email &&  updatedProfileItems.email !== req.user.email){
        console.log('Email Id is different!');
        updatedProfileItems.emailVerified = false;
    }
    let userUpdate = await User.findByIdAndUpdate(req.params.id, updatedProfileItems,{ new: true } );
    console.log(userUpdate);
    if(!userUpdate){
        req.flash('error', "Facing some error, please try again!");
        res.redirect('back');
    }
    req.flash('success', 'Changes successfully saved!');
    res.redirect(`/account-details/${req.user.id}/edit`);

} catch(error){
    console.log(error);
    req.flash('error', error.message);
    res.redirect('back');
}
})



//----------------------------------------------------------------------------//
//----------------------------Filter Data Details-----------------------------//
//----------------------------------------------------------------------------//

router.get('/filterform', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let filterList = await Exam.find({}).exec();
        let teacherList = await Teacher.find({}).populate({ path: 'registeredUser', select: 'displayName' }).exec();
        console.log('teacherList');
        console.log(teacherList);
        console.log('teacherList.registeredUser');
        console.log(teacherList.registeredUser);
        if(req.xhr){
           return res.json({exams:filterList, teachers:teacherList});
        }
        res.render('index2', { page: 'filter-list', title: 'Filter List', exams: filterList, teachers: teacherList });
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('back');
    }
})

router.get('/filterform/:id/edit', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let editFilterData = await Exam.findById(req.params.id);
        res.render('index2', { page: 'filter-edit-form', title: 'Filter List', exams: editFilterData });

    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('back');
    }
})

router.get('/filterform/new', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let foundExam = await Exam.find({}).exec();
        if (!foundExam) {
            req.flash('error', 'Please try again')
            res.redirect('back')
        }
        res.render('index2', { page: 'filter-form', title: 'Filter Form', exams: foundExam });
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
});

router.post('/filterform', isLoggedIn, isAdmin, async function (req, res) {
    try {
        console.log(req.body.filterform);
        req.body.filterform.username =  req.body.filterform.displayName;
        let newExam = await Exam.create(req.body.filterform);
        req.flash('success', 'Your entry was successfully added in the Database');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
});

router.put('/filterform/:id',  isLoggedIn, isAdmin, async function (req, res) {
    try {
        let foundExam = await Exam.findByIdAndUpdate(req.params.id, req.body.filterform, { new: true });
        console.log(foundExam);
        req.flash('success', 'The data was successfully edited.');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
})

router.delete('/filterform/:id', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let deleteExamData = await Exam.findByIdAndDelete(req.params.id);
        req.flash('success', 'The data was successfully deleted.');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
});

router.get('/api/filterdata', async function (req, res) {
    try {
        let filterList = await Exam.find({}).exec();
        let teachers = await Teacher.find({}).populate({path:'registeredUser', select:'displayName'});
        // let teachers = await User.find({isFaculty:true});
        if(!filterList){
            return console.log('Some issue. Try again')
        }
        console.log('teachers');
        console.log(teachers);
        res.json({exams:filterList, teachers});
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('back');
    }
})

router.get('/api/filterform/:exam/subjects', async function(req,res){
    try {
        let subjects = await Exam.find({exam:req.params.exam});
        if(!subjects){
            return console.log('Some issue. Try again')
        }
        res.json(subjects);
    } catch (error) {
        console.log(error);  
    }
});



//----------------------------------------------------------------------------//
//-----------------------Filter Form-Teachers Details-------------------------//
//----------------------------------------------------------------------------//



// router.get('/teacherform', isLoggedIn, isAdmin, async function (req, res) {
//     try {
//         let teacherList = await Teacher.find({}).exec();
//         if(req.xhr){
//            return res.json({exams:teacherList});
//         }
//         res.render('index2', { page: 'filter-list', title: 'Filter List', exams: teacherList });
//     } catch (error) {
//         console.log(error);
//         req.flash('error', error.message);
//         res.redirect('back');
//     }
// })


router.get('/teacherform/:id/edit', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let adminAuthor = await Teacher.findById(req.params.id).populate({ path: 'registeredUser', select: 'displayName' }).exec();
        console.log('adminAuthor');
        console.log(adminAuthor);
        res.render('index2', { page: 'filter-edit-form-teacher', title: 'Teacher List', teacher: adminAuthor });

    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('back');
    }
})

router.get('/teacherform/new', isLoggedIn, isAdmin, async function (req, res) {
    try {
        res.render('index2', { page: 'filter-form-teacher', title: 'Teacher Form'});
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/teacherform');
    }
});

router.post('/teacherform', isLoggedIn, isAdmin, async function (req, res) {
    try {
        req.body.teacher.byAdmin=true;
        req.body.teacher.username= req.body.teacher.displayName;
        console.log(req.body.teacher);
        let adminAauthor = await Teacher.create(req.body.teacher);
        console.log(adminAauthor);
        req.flash('success', 'Your entry was successfully added in the Database');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
});

router.put('/teacherform/:id',  isLoggedIn, isAdmin, async function (req, res) {
    try {
        let foundTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body.teacher, { new: true });
        console.log(foundTeacher);
        req.flash('success', 'The data was successfully edited.');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
})

router.delete('/teacherform/:id', isLoggedIn, isAdmin, async function (req, res) {
    try {
        let deleteExamData = await Teacher.findByIdAndDelete(req.params.id);
        req.flash('success', 'The data was successfully deleted.');
        res.redirect('/filterform');
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('/filterform');
    }
});



router.get('/api/teacherdata', async function (req, res) {
    try {
        let teachers = await Teacher.find({}).exec();
        if(!teachers){
            return console.log('Some issue. Try again')
        }
        res.json({teachers});
    } catch (error) {
        console.log(error);
        req.flash('error', error.message);
        res.redirect('back');
    }
})




// router.post('/notification/id', (req,res)=>{
//     io.getIO().emit('notification')
// })




module.exports = router;