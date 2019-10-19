const express = require("express");
const router = express.Router();
const Download = require("../models/download.js");
const Video = require("../models/video.js");
const User = require("../models/user.js");
const middleware = require("../middleware");
const { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilterDocs, searchAndFilterVideoCopy, searchAndFilterFaculty, searchAndFilterStudent } = middleware;
// const multer  = require('multer');
// const storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// const upload = multer({ storage: storage});

// const cloudinary = require('cloudinary').v2;
//     cloudinary.config({ 
//       cloud_name: 'clubstorage', 
//       api_key: process.env.CLOUDINARY_API_KEY, 
//       api_secret: process.env.CLOUDINARY_API_SECRET
//     });


//----------------------------------------------------------------------------//
//--------------------------Teacher's Index Route-----------------------------//
//----------------------------------------------------------------------------//
router.get("/teachers", (req, res) => {
    User.find({ isFaculty: true }).populate({ path: "downloads", select: "downloadCounter" }).exec((err, foundTeacher) => {
        if (err) {
            return console.log(err);
        }
        res.render("index2", { teachers: foundTeacher, page: 'teachersindex', title: "Facultys' Directory" });
        // res.render("teacher/list", {teachers: foundTeacher, page:'teachersindex'});
        // res.json(foundTeacher);
    })
});

// //----------------------------------------------------------------------------//
// //----------------------Teacher's Profile CREATE Form(GET)--------------------//
// //----------------------------------------------------------------------------//
// router.get("/teachers/new", function (req, res) {
//     res.render("teacher/new");
// });

// //----------------------------------------------------------------------------//
// //--------------------------Teacher's Profile Route(POST)----------------------//
// //----------------------------------------------------------------------------//
// router.post("/teachers", (req, res) => {
//     var newTeacher = req.body.teacher;
//     User.create(newTeacher, function (err, newlyCreated) {
//         if (err) {
//             console.log(err)
//             return res.redirect("back");
//         }
//         res.redirect("/teachers/" + newlyCreated.id)
//     })
// })


//----------------------------------------------------------------------------//
//-----------------------Teacher's Profile SHOW Route(GET)--------------------//
//----------------------------------------------------------------------------//
// router.get("/teachers/:id", (req, res) => {
//     User.findById(req.params.id).populate("downloads").populate("videos").exec(function (err, foundTeacher) {
//         if (err) {
//             console.log(err);
//             res.redirect("back");
//         } else
//             res.render("index2", { teacher: foundTeacher, page: "facultyprofile", title: "Faculty's Profile" });
//         // res.render("teacher/profile", {teacher: foundTeacher, page:"facultyprofile"});
//     });
// })

router.get("/teachers/:id", async (req,res)=>{

    let facultyId={
        '_id': req.params.id,
    }

    if (req.user){
        var currentUser = await User.findById(req.user._id);
    }
    if(!req.user){
        var currentUser = 'none'
     }
    
    var facultyProfile = await User.paginate(facultyId, {
        populate:[
        {path:'downloads', model: 'Download',  options: { sort: req.query.sort} }, 
        {path:'videos', model: 'Video', options: { sort: req.query.sort} },
        ],
        sort: req.query.sort || '-accountCreated',
    });
    console.log('facultyProfile1');
    console.log(facultyProfile);

    // if (!facultyProfile) {
    //     req.flash("error");
    //     return res.redirect("back");
    // }

    var attemptsButtons = {
        "Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary', 'mobile': 'kt-badge--unified-primary' },
        "May 2020": { 'title': "May 2020", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
        "Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
        "May 2021": { 'title': "May 2021", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
        "Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
    };

    var examsButtons = {
        "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
        "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
        "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
        "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile': 'kt-badge--unified-info' },
        "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand', 'mobile': 'kt-badge--unified-brand' },
        "General": { 'title': "General", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
        "": { 'title': "", 'class': 'btn-label-light', 'mobile': 'kt-badge--unified-light' },
    };

    facultyProfile.attemptsButtons = attemptsButtons;
    facultyProfile.examsButtons = examsButtons;
    facultyProfile.currentUser = currentUser;
    

    if (req.xhr) {
        return res.json({ faculty:facultyProfile});
    } else {
         return res.render("index2", { page: "facultyprofile", faculty:facultyProfile, teacher:facultyProfile, title: "Faculty's Profile" });
    }

});

//----------------------------------------------------------------------------//
//--------------------------------USERS GET Dashboard-------------------------//
//----------------------------------------------------------------------------//

// ------------------------>Different Method[Populate]!!!<----------------------//
router.get("/user/:id/dashboard", isLoggedIn, searchAndFilterDocs, searchAndFilterVideoCopy, searchAndFilterFaculty, searchAndFilterStudent, async (req, res) => {
    try{
    let foundUser = await User.findById(req.params.id);
    if (!foundUser) {
        req.flash('error', "User not found! Please log in again!");
        res.redirect('back');
    }

    if (foundUser.isAdmin === true) {

        //-------------------------------------------------Documents----------------------------------------------//

        const { docdbQuery, docspaginateUrl } = res.locals;
        delete res.locals.docdbQuery;
        var downloads = await Download.paginate(docdbQuery,
            {
            populate:{path:'author.id', model: 'User', select: 'firstName lastName' },
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: req.query.sort || '-createdAt',
        });
        console.log('docdbQuery');
        console.log(docdbQuery);
        if (!downloads) {
            req.flash("error");
            res.redirect("back");
        }

        var attemptsButtons = {
            "Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary', 'mobile': 'kt-badge--unified-primary' },
            "May 2020": { 'title': "May 2020", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "May 2021": { 'title': "May 2021", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
        };

        var examsButtons = {
            "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile': 'kt-badge--unified-info' },
            "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand', 'mobile': 'kt-badge--unified-brand' },
            "General": { 'title': "General", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
            "": { 'title': "", 'class': 'btn-label-light', 'mobile': 'kt-badge--unified-light' },
        };

        downloads.pageUrl = docspaginateUrl;
        downloads.attemptsButtons = attemptsButtons;
        downloads.examsButtons = examsButtons;

        //------------------------------------------------Videos-------------------------------------------//

        const { dbQuery, videospaginateUrl } = res.locals;
        delete res.locals.dbQuery;

        var videos = await Video.paginate(dbQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: req.query.sort || '-createdAt',
        });
        videos.pageUrl = videospaginateUrl;

        //-------------------------------------------FacultyList------------------------------------------//
        const {facultydbquery, facultypaginateUrl } = res.locals;
        delete res.locals.facultydbquery;
        console.log('facultydbquery');
        console.log(facultydbquery);
        var facultyList = await User.paginate(facultydbquery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: req.query.sort || '-accountCreated',
        });
        facultyList.pageUrl = facultypaginateUrl;

        //-------------------------------------------StudentList------------------------------------------//

        const {studentdbquery, studentpaginateUrl } = res.locals;
        delete res.locals.studentdbquery;
        console.log('studentdbquery');
        console.log(studentdbquery);

        var studentList = await User.paginate(studentdbquery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: req.query.sort || '-accountCreated',
        });

        studentList.pageUrl = studentpaginateUrl;

        //------------------------------------------------------------------------------------------------//

        if (req.xhr) {
            return res.json({ user: foundUser, downloads, videos, student: studentList, faculty: facultyList, });
        } else {
            return res.render("index2", {
                page: "dashboard_admin", user: foundUser, downloads,
               videos, student: studentList, faculty: facultyList, title: "Dashboard"
            });
            //   res.render("dashboard_admin",{page:"dashboard_admin", user:foundUser, downloads: downloads, videos: videos});
        }




    } else if (foundUser.isFaculty === true) {

        let facultyId={
            '_id': req.params.id,
        }


        var foundFaculty = await User.paginate(facultyId, {
            populate:[
            {path:'downloads', model: 'Download',  options: { sort: req.query.sort} }, 
            {path:'videos', model: 'Video', options: { sort: req.query.sort} },
            ],
            sort: req.query.sort || '-accountCreated',
        });

        if (!foundFaculty) {
            req.flash("error");
            res.redirect("back");
        }

        var attemptsButtons = {
            "Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary', 'mobile': 'kt-badge--unified-primary' },
            "May 2020": { 'title': "May 2020", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "May 2021": { 'title': "May 2021", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
        };

        var examsButtons = {
            "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile': 'kt-badge--unified-info' },
            "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand', 'mobile': 'kt-badge--unified-brand' },
            "General": { 'title': "General", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
            "": { 'title': "", 'class': 'btn-label-light', 'mobile': 'kt-badge--unified-light' },
        };

        foundFaculty.attemptsButtons = attemptsButtons;
        foundFaculty.examsButtons = examsButtons;
        

        console.log(foundUser);
        if (req.xhr) {
            return res.json({ faculty:foundFaculty });
        } else {
             return res.render("index2", { page: "dashboard_faculty", faculty:foundFaculty, title: "Dashboard" });
        }


        // await User.findById(req.params.id).populate("downloads").populate("videos").exec((err, foundUser) => {
        //     if (err) {
        //         return console.log(err);
        //     } else {
        //         if (req.xhr) {
        //             res.json({ user: foundUser });
        //         } else {
        //             return res.render("index2", { page: "dashboard_faculty", user: foundUser, title: "Dashboard" });
        //             // res.render("dashboard_faculty",{page:"dashboard_faculty", user:foundUser});
        //         }
        //     }
        // });







    } else if (foundUser.isStudent === true) {
        // const { docdbQuery, docspaginateUrl } = res.locals;
        // delete res.locals.docdbQuery;

        let studentId={
            '_id': req.params.id,
        }
        // let limits = req.query.limit ?  parseInt(req.query.limit) : 10;
        // let pages = req.query.page ? parseInt(req.query.page) : 1;
        // let sorts = req.query.sort ? req.query.sort : '-createdAt';


        var foundStudent = await User.paginate(studentId, {
            populate:[
            {path:'downloadBookmarks', model: 'Download',  options: { sort: req.query.sort} }, 
            {path:'videoBookmarks', model: 'Video', options: { sort: req.query.sort} }
            ],
            // page: parseInt(req.query.page) || 1,
            // limit: parseInt(req.query.limit) || 10,
            // sort: req.query.sort || '-createdAt',
        });
        
        // console.log('page');
        // console.log(req.query.page);
        // console.log('limit');
        // console.log(req.query.limit);
        // console.log('sort');
        // console.log(req.query.sort);
        // let foundStudent = await User.findById(req.user.id).populate('downloadBookmarks').populate('videoBookmarks').exec();
        
        if (!foundStudent) {
            req.flash("error");
            res.redirect("back");
        }

        var attemptsButtons = {
            "Nov 2019": { 'title': "Nov 2019", 'class': 'btn-label-primary', 'mobile': 'kt-badge--unified-primary' },
            "May 2020": { 'title': "May 2020", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "Nov 2020": { 'title': "Nov 2020", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "May 2021": { 'title': "May 2021", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "Nov 2021": { 'title': "Nov 2021", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
        };

        var examsButtons = {
            "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile': 'kt-badge--unified-success' },
            "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile': 'kt-badge--unified-danger' },
            "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile': 'kt-badge--unified-warning' },
            "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile': 'kt-badge--unified-info' },
            "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand', 'mobile': 'kt-badge--unified-brand' },
            "General": { 'title': "General", 'class': 'btn-label-dark', 'mobile': 'kt-badge--unified-dark' },
            "": { 'title': "", 'class': 'btn-label-light', 'mobile': 'kt-badge--unified-light' },
        };

        foundStudent.attemptsButtons = attemptsButtons;
        foundStudent.examsButtons = examsButtons;
        

        console.log(foundUser);
        if (req.xhr) {
            return res.json({ student:foundStudent });
        } else {
             return res.render("index2", { page: "dashboard_student", student:foundStudent, title: "Dashboard" });
        }
    }

    // if (foundUser.isStudent === true) {
    //     console.log(req.user);
    //     await User.findById(req.params.id).populate("downloadBookmarks").populate("videoBookmarks").exec((err, foundUser) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             if (req.xhr) {
    //                 res.json({ user: foundUser });
    //             } else {
    //                 console.log(foundUser)
    //                 res.render("index2", { page: "dashboard_student", user: foundUser, title: "Dashboard" });
    //                 // res.render("dashboard_student",{page:"dashboard_student", user:foundUser});

    //             }
    //         }
    //     });
    // }

} catch(error){
    console.log('DummmmmError');
    console.log(error);
}
});
    // Not EDITED
    // ------------------------>Different Method[Populate]!!!<----------------------
    // router.get("/user/:id/dashboard", isLoggedIn, searchAndFilterDocs,(req,res)=>{
    //     User.findById(req.params.id, async (err,foundUser)=>{
    //         if(err){
    //             console.log(err);
    //         } else { 
    //             if(foundUser.isAdmin===true){
    //             const {docdbQuery, paginateUrl} = res.locals;
    //             delete res.locals.docdbQuery;
    //             console.log('*****docdbquery****');
    //             console.log(docdbQuery);
    //             var downloads = await Download.paginate(docdbQuery, {
    //                 page: parseInt(req.query.page) || 1,
    //                 limit: parseInt(req.query.limit) || 10,
    //                 sort: req.query.sort || '-createdAt',
    //             });
    //             if(!downloads){
    //             req.flash("error");
    //             res.redirect("back");
    //             }
    //             //   let downloads = await Download.find({docdbQuery}).exec();
    //               let videos = await Video.find({}).exec();

    //               let studentList = await User.find({isStudent: true}).exec();
    //               console.log(studentList);
    //               console.log('**********');
    //               let facultyList = await User.find({isFaculty: true}).exec();
    //               console.log(facultyList);
    //               if(req.xhr){
    //                   res.json({user:foundUser, downloads:downloads, videos:videos, students: studentList, facultys: facultyList,});
    //               } else {
    //               res.render("index2",{page:"dashboard_admin", user:foundUser, downloads: downloads, 
    //               videos: videos, students: studentList, facultys: facultyList, title: "Dashboard"});
    //             //   res.render("dashboard_admin",{page:"dashboard_admin", user:foundUser, downloads: downloads, videos: videos});
    //                   }
    //               }

    //             if(foundUser.isFaculty===true){
    //                await  User.findById(req.params.id).populate("downloads").populate("videos").exec((err,foundUser)=>{
    //                 if(err){
    //                 console.log(err);
    //                 } else {
    //                  if(req.xhr){
    //                   res.json({user:foundUser});
    //                 }else {
    //                 res.render("index2",{page:"dashboard_faculty", user:foundUser, title: "Dashboard"});
    //                 // res.render("dashboard_faculty",{page:"dashboard_faculty", user:foundUser});
    //               }    
    //                 }
    //             });
    //         } 
    //         if(foundUser.isStudent===true){
    //             console.log(req.user);
    //                await  User.findById(req.params.id).populate("downloadBookmarks").populate("videoBookmarks").exec((err,foundUser)=>{
    //                 if(err){
    //                 console.log(err);
    //                 } else {
    //                  if(req.xhr){
    //                   res.json({user:foundUser});
    //                 }else {
    //                     console.log(foundUser)
    //                 res.render("index2",{page:"dashboard_student", user:foundUser, title: "Dashboard"});
    //                 // res.render("dashboard_student",{page:"dashboard_student", user:foundUser});

    //               }    
    //                 }
    //             });
    //         } 
    //     }
    // });
    // });


    // Untouched
    // router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
    //     User.findById(req.params.id, async (err,foundUser)=>{
    //         if(err){
    //             console.log(err);
    //         } else { 
    //             if(foundUser.isAdmin===true){
    //               let downloads = await Download.find({}).exec();
    //               let videos = await Video.find({}).exec();

    //               let studentList = await User.find({isStudent: true}).exec();
    //               console.log(studentList);
    //               console.log('**********');
    //               let facultyList = await User.find({isFaculty: true}).exec();
    //               console.log(facultyList);
    //               if(req.xhr){
    //                   res.json({user:foundUser, downloads:downloads, videos:videos, students: studentList, facultys: facultyList,});
    //               } else {
    //               res.render("index2",{page:"dashboard_admin", user:foundUser, downloads: downloads, 
    //               videos: videos, students: studentList, facultys: facultyList, title: "Dashboard"});
    //             //   res.render("dashboard_admin",{page:"dashboard_admin", user:foundUser, downloads: downloads, videos: videos});
    //                   }
    //               }

    //             if(foundUser.isFaculty===true){
    //                await  User.findById(req.params.id).populate("downloads").populate("videos").exec((err,foundUser)=>{
    //                 if(err){
    //                 console.log(err);
    //                 } else {
    //                  if(req.xhr){
    //                   res.json({user:foundUser});
    //                 }else {
    //                 res.render("index2",{page:"dashboard_faculty", user:foundUser, title: "Dashboard"});
    //                 // res.render("dashboard_faculty",{page:"dashboard_faculty", user:foundUser});
    //               }    
    //                 }
    //             });
    //         } 
    //         if(foundUser.isStudent===true){
    //             console.log(req.user);
    //                await  User.findById(req.params.id).populate("downloadBookmarks").populate("videoBookmarks").exec((err,foundUser)=>{
    //                 if(err){
    //                 console.log(err);
    //                 } else {
    //                  if(req.xhr){
    //                   res.json({user:foundUser});
    //                 }else {
    //                     console.log(foundUser)
    //                 res.render("index2",{page:"dashboard_student", user:foundUser, title: "Dashboard"});
    //                 // res.render("dashboard_student",{page:"dashboard_student", user:foundUser});

    //               }    
    //                 }
    //             });
    //         } 
    //     }
    // });
    // });

    // router.get("/user/:id/dashboard", isLoggedIn, (req, res) => {
    //     const currentUser = req.user;
    //             if(currentUser && currentUser.isAdmin){
    //             res.json("dashboard_admin");               
    //             } else if(currentUser && currentUser.isFaculty){
    //              res.render("dashboard_faculty");  
    //             }else if(currentUser && currentUser.isStudent){
    //              res.render("dashboard_student", {page: "dashboard"});  
    // }
    // });

    // -------------------------->Different Method[ID = ID]!!!<---------------------------------
    // router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
    //     User.findById(req.params.id, (err,foundUser)=>{
    //         if(err){
    //             console.log(err);
    //         } else { 
    //         Video.find().where("author.id").equals(foundUser.id).exec((err, videos)=>{
    //                         if(err){
    //                             req.flash("error",err.message);
    //                         } else{
    //                             res.render("dashboard_faculty",{videos, user:foundUser});
    //                         }
    //                     });
    //         }
    //     });
    // });

    // // -------------------------->Different Method[Populate]!!!<---------------------------------
    // router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
    //     User.findById(req.params.id).populate("downloads").populate("videos").exec((err,foundUser)=>{
    //         if(err){
    //             console.log(err);
    //         } else { 
    //             if(foundUser.isAdmin===true){}
    //         res.render("dashboard_faculty",{user:foundUser});
    //         }
    //     });
    // });



    // router.get("/user/:id/dashboard", isLoggedIn, (req,res)=>{
    //     User.findById(req.params.id, (err,foundUser)=>{
    //         if(err){
    //             console.log(err);
    //         } else if (foundUser.isAdmin === true){
    //             Video.find({}, (err,videos)=>{
    //                 if(err){
    //                     console.log(err);
    //                 } else {
    //                     res.render("dashboard_admin", {videos});
    //                 }
    //             });
    //         } else if (foundUser.isFaculty === true){
    //                     Video.find().where("author.id").equals(foundUser.Id).exec((err, videos)=>{
    //                         if(err){
    //                             req.flash("error",err.message);
    //                         } else{
    //                             res.render("dashboard_faculty",{videos});
    //                         }
    //                     });
    //         } else if(foundUser.isStudent === true){
    //             res.render("dashboard_faculty")
    //         } 
    //     });
    // });



    //----------------------------------------------------------------------------//
    //-----------------------------------User Save Video--------------------------//
    //---------------------{is the writing format fine??}-------------------------//

    router.put("/user/:id/videos/:video_id", isStudent, async (req, res) => {
        try {
            let foundUser = await User.findById(req.params.id);
            let foundVideo = await Video.findById(req.params.video_id);
            if (foundUser.isStudent) {
                if (foundUser.videoBookmarks.includes(foundVideo.id)) {
                    console.log("includes");
                    await User.findByIdAndUpdate(req.user._id, { $pull: { videoBookmarks: foundVideo.id } });
                    foundUser.save();
                    if (req.xhr) {
                        let message = "Successfully removed the video from your bookmarks";
                        res.json(message);
                    } else {
                        req.flash("success", "Successfully removed the video from your bookmarks");
                        return res.redirect("back");
                    }
                } else {
                    console.log("does not include");
                    foundUser.videoBookmarks.push(foundVideo);
                    foundUser.save();
                    if (req.xhr) {
                        let message = "Successfully added the video to your bookmarks";
                        res.json(message);
                    } else {
                        req.flash("success", "Successfully added the video to your bookmarks");
                        return res.redirect("back");
                    }
                }
            } else {
                if (req.xhr) {
                    let message = "You need to be signed to bookmark videos";
                    res.json(message);
                } else {
                    req.flash("error", "You need to be signed to bookmark videos");
                }
            }
        } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    });



    //----------------------------------------------------------------------------//
    //------------------------------User Save Document----------------------------//
    //----------------------------------------------------------------------------//
    router.put("/user/:id/downloads/:doc_id", isStudent, async (req, res) => {
        try {
            let foundUser = await User.findById(req.params.id);
            let foundDownloads = await Downloads.findById(req.params.doc_id);
            if (foundUser.isStudent) {
                if (foundUser.downloadsBookmarks.includes(founddownloads.id)) {
                    console.log("includes");
                    await User.findByIdAndUpdate(req.user._id, { $pull: { downloadsBookmarks: founddownloads.id } });
                    foundUser.save();
                    req.flash("success", "Successfully removed the downloads from your bookmarks");
                    return res.redirect("back");
                } else {
                    console.log("does not include");
                    foundUser.downloadsBookmarks.push(founddownloads);
                    foundUser.save();
                    req.flash("success", "Successfully added the downloads to your bookmarks");
                    return res.redirect("back");
                }
            } else {
                req.flash("error", "You need to be signed to bookmark downloadss");
            }
        } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    });


    //----------------------------------------------------------------------------//
    //--------------------------------Follow Put Request--------------------------//
    //----------------------------------------------------------------------------//
    router.put('/follow/:id', async (req, res) => {
        try {
            let user = await User.findById(req.user.id);
            let teacher = await User.findById(req.params.id);
            console.log(req.user._id);
            if (!user || !teacher) {
                console.log("Some error, try again!");
            }
            let following = await user.following.includes(req.params.id);
            let follower = await teacher.followers.includes(req.user._id);

            if (follower || following) {
                user.following.splice(req.params.id.toString(), 1);
                user.save();
                teacher.followers.splice(req.user._id.toString(), 1);
                teacher.save();
                return res.json({ message: `Faculty ${teacher.username} has been unfollowed`, class: 'success', user, teacher });
            }

            user.following.push(req.params.id);
            user.save();
            teacher.followers.push(req.user._id);
            teacher.save();
            return res.json({ message: `Faculty ${teacher.username} has been followed`, class: 'danger', user, teacher });
        } catch (error) {
            console.log(error)
        }
    })

    


    module.exports = router;