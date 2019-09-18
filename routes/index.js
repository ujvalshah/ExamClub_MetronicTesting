var express = require("express");
var router = express.Router();
var passport = require("passport");
const crypto = require("crypto");
const util = require('util');
var User = require("../models/user.js");
var Notification = require("../models/notifications.js");
var Subscriber = require("../models/subscribers.js");
const { sendPasswordResetMail, sendPasswordResetConfirmationMail, sendEmailVerificationMail} = require("../middleware/email.js");
const { isLoggedIn, isEmailVerified } = require("../middleware/index.js");
const io = require("../utils/sockets.js");
//----------------------------------------------------------------------------//
//--------------------------Index Route Of Application------------------------//
//----------------------------------------------------------------------------//
router.get("/", isEmailVerified, function (req, res) {
    // res.redirect("/downloads");
    res.render("index2", {page: "homepage", title: "Home"});
});


//----------------------------------------------------------------------------//
//--------------------------Registration Form Route---------------------------//
//----------------------------------------------------------------------------//

router.get("/register", function (req, res) {
    req.flash("error");
    res.render("register", { page: 'register' });
})

//----------------------------------------------------------------------------//
//--------------------------Registration[POST] Route--------------------------//
//----------------------------------------------------------------------------//

router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        email: req.body.user.email,
        mobile: req.body.user.mobile,
    });
    if (req.body.actype === "isStudent") {
        newUser.isStudent = true;
    } else if (req.body.actype === "isFaculty") {
        newUser.isFaculty = true;
    } else if (req.body.actype === "isAdmin") {
        newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, async function () {
            try {
                const user = await User.findOne({ _id: req.user._id });
                console.log(user);
                const userEmail  = user.email;
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
                    req.flash('warning',`Your faculty account needs to be approved by the admin before you can access it.
                    Usually it takes 2-3 hours to get approved. Please wait till then.
                    For any further enquiries email at caexamclub@gmail.com.
                    Also for account validation it is necessary that your Email Id ${userEmail} is validated.
                    Please check your email for our validation mail. Thanks`);
                    res.redirect('/login');
                } else {
                    req.flash("success", `An e-mail has been sent to verify ${userEmail}.`);
                    res.redirect("/");
                };

            } catch (err) {
                console.log(err);
                req.flash("error", err.message);
                return res.redirect("/");
            }
        });
    });
});

// ----------------------------------------------------------------------------//
// -----------------------------Email Verification Route-----------------------//
// ----------------------------------------------------------------------------//

router.get("/email-verification", isLoggedIn, async (req,res)=>{
    res.render("index2", {page:'email-verification', title: 'Email-verification'});
})

router.put("/email-verification", isLoggedIn, async(req,res)=>{
    try {
        var user = await User.findOne({ _id: req.user._id });
        var userEmail  = user.email;
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
        res.redirect("/email-verification");
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
        return res.redirect("/forgot-password");
    }
});



//----------------------------------------------------------------------------//
//------------------------------------Login Route-----------------------------//
//----------------------------------------------------------------------------//

router.get("/login",function (req, res) {
    req.flash("error");

    res.render("login", { page: 'login', title: "Login" });
})

router.get("/faculty-validation", async (req,res)=>{
    if (req.user.isFaculty === true && req.user.isFacultyVerified === false) {
        req.logout();
        req.flash('warning',`Your faculty account needs to be approved by the admin before you can access it.
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
    req.flash("success", "Successfully logged out");
    res.redirect("/");
})


//----------------------------------------------------------------------------//
//-------------------------------Forgot Password------------------------------//
//----------------------------------------------------------------------------//
router.get("/forgot-password", (req, res) => {
    res.render("forgot");
});


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
        req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
        res.redirect("/forgot-password");
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
        res.render("reset", { token });
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
        return res.redirect("/");
    } catch (err) {
        console.log(err);
        req.flash("error", err);
        return res.redirect("/login");
    }
});


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
//------------------------------Edit User Details-----------------------------//
//----------------------------------------------------------------------------//
router.get('/account-details', isLoggedIn ,async(req,res)=>{
    let user = await User.findById(req.user._id);
    res.render('index2', {page:'account-details', title:'Account Details', user});
});









// router.post('/notification/id', (req,res)=>{
//     io.getIO().emit('notification')
// })




module.exports = router;