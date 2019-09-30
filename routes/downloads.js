const express = require("express");
const router = express.Router();
const fs = require('fs');
const Download = require("../models/download.js");
const User = require("../models/user.js");
const multer = require('multer');
const path = require("path");
const middleware = require("../middleware");
const moment = require('moment');
const { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilterDocs } = middleware;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/docs')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.slice(0, file.originalname.length - 4) + "_" + Date.now() + '.' + file.mimetype.slice(-3));
    }
});
const upload = multer({ storage: storage });

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'clubstorage',
    api_key: 416484648518755,
    api_secret: "IesDyaDBBctXu9yM9OZv3_yNhm4"
});

//----------------------------------------------------------------------------//
//--------------------------Downloads Routes----------------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads",searchAndFilterDocs, function(req, res){
    const {docdbQuery, docspaginateUrl} = res.locals;
    delete res.locals.docdbQuery;

    console.log('*****docdbquery****');
    console.log(docdbQuery);
    Download.find(docdbQuery, (err, foundDownload) => {
        if (err) {
            req.flash("error");
            res.redirect("back");
        } else {
            console.log('----------');
            console.log(res.locals.docquery);
            console.log('----------');
            console.log(foundDownload.length);
            
            if (!foundDownload.length && res.locals.query) {
                res.locals.error = 'No results match that query.';
                }
            res.render("index2", { downloads: foundDownload, docspaginateUrl, page: "downloads", title: "Downloads"});
            // res.render("downloads/downloads", {downloads: foundDownload, page: downloads});
        }
    });
});

router.get("/downloadscopy",searchAndFilterDocs, async function(req, res){
    try{
    console.log('*****Req.Query***********');   
    console.log(req.query);   
    console.log('*****Req.Query***********');   
    const {docdbQuery, docspaginateUrl} = res.locals;
    delete res.locals.docdbQuery;

    console.log('*****docdbquery****');
    console.log(docdbQuery);

    var foundDownload = await Download.paginate(docdbQuery, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sort: req.query.sort || '-createdAt',
    });
    if(!foundDownload){
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

        examsButtons = {
            "CA Final(New)": { 'title': "CA Final(New)", 'class': 'btn-label-success', 'mobile':'kt-badge--unified-success' },
            "CA Final(Old)": { 'title': "CA Final(Old)", 'class': 'btn-label-danger', 'mobile':'kt-badge--unified-danger' },
            "CA Intermediate(New)": { 'title': "CA Intermediate(New)", 'class': 'btn-label-warning', 'mobile':'kt-badge--unified-warning' },
            "CA IPCC(Old)": { 'title': "CA IPCC(Old)", 'class': 'btn-label-info', 'mobile':'kt-badge--unified-info' },
            "CA Foundation(New)": { 'title': "CA Foundation(New)", 'class': 'btn-label-brand', 'mobile':'kt-badge--unified-brand' },
            "General": { 'title': "General", 'class': 'btn-label-dark', 'mobile':'kt-badge--unified-dark' },
            "": { 'title': "", 'class': 'btn-label-light', 'mobile':'kt-badge--unified-light' },
        };

    if(req.xhr){
        console.log(foundDownload.docs.length);
        foundDownload.pageUrl = docspaginateUrl;
        foundDownload.attemptsButtons = attemptsButtons;
        foundDownload.examsButtons = examsButtons;
        if(req.user){
            let loggedinUser = await User.findById(req.user._id);
            foundDownload.loggedinUser = loggedinUser;
            return res.json(foundDownload);
        }
        return res.json(foundDownload);
    } else {
        console.log('----------');
        console.log(res.locals.docquery);
        console.log('----------');
        console.log(foundDownload.docs.length);
        console.log('----------');
        if (!foundDownload.length && res.locals.query) {
            res.locals.error = 'No results match that query.';
            }
        res.render("index2", { downloads: foundDownload, attemptsButtons, examsButtons, page: "downloadscopy", title: "Downloads"});
    }
} catch(error){
    console.log(error);
}
});


// router.get("/downloadscopy",searchAndFilterDocs, async function(req, res){
//     const {docdbQuery} = res.locals;
//     delete res.locals.docdbQuery;

//     console.log('*****docdbquery****');
//     console.log(docdbQuery);


//     Download.find(docdbQuery, (err, foundDownload) => {
//         if (err) {
//             req.flash("error");
//             res.redirect("back");
//         } else {
//             if(req.xhr){
//                 res.json(foundDownload);
//             }
//             else {
//             console.log('----------');
//             console.log(res.locals.docquery);
//             console.log('----------');
//             console.log(foundDownload.length);
            
//             if (!foundDownload.length && res.locals.query) {
//                 res.locals.error = 'No results match that query.';
//                 }
//             res.render("index2", { downloads: foundDownload, page: "downloadscopy", title: "Downloads"});
//             // res.render("downloads/downloads", {downloads: foundDownload, page: downloads});
//         }};
//     });
// });
// {downloads: "edit data"}

router.get("/downloads/caintermediate", function (req, res) {
    res.render("downloads/bootstraptable");
});

router.get("/downloads/cafoundation", function (req, res) {
    Download.find({}, (err, foundDownload) => {
        if (err) {
            console.log(err);
        } else {
            res.render("downloads/downloads_cafinal1Copy");
        }
    });
});


router.get("/downloads/ajax", function (req, res) {
    res.render("downloads/datatables_ajax", { downloads: "edit data" });
});
//----------------------------------------------------------------------------//
//----------------------Downloads - Upload - Form-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/upload", isLoggedIn, isTeacherOrAdmin, function (req, res) {
    res.render("index2", { page: "downloads_uploadform", title: "Document Upload Form" });
    // res.render("downloads/upload");
});


//----------------------------------------------------------------------------//
//------------------------Downloads - POST - Form-----------------------------//
//----------------------------------------------------------------------------//

router.post("/downloads", upload.single('document'), async function (req, res, next) {
    req.body.download.file = [];

    req.body.download.file.push({
        url: req.file.path,
        // public_id: doc.public_id
    });
    req.body.download.author.id = req.user._id;
    let download = await Download.create(req.body.download);
    User.findById(req.user._id, function (err, foundUser) {
        if (err) {
            req.flash("error");
            res.redirect("/downloads/new");
        } else {
            foundUser.downloads.push(download);
            foundUser.save();
        }
    })
    res.redirect("/downloads");
});

//WITH CLOUDINARY
// router.post("/downloads", upload.single('document'), async function(req, res, next){
//     req.body.download.file=[];
//             let doc = await cloudinary.uploader.upload(req.file.path, 
//                 {resource_type: "raw",
//                  use_filename : "true",
//                  unique_filename : "false",
//                 }, function(error, result){
//                     console.log(result,error);
//                 });
//             req.body.download.file.push({
//                 url: doc.secure_url,
//                 public_id: doc.public_id
//             });
//         req.body.download.author.id = req.user._id;
//         let download = await Download.create(req.body.download);
//         User.findById(req.user._id, function(err, foundUser) {
//             if(err){
//                 req.flash("error");
//                 res.redirect("/downloads/new");
//             } else {
//                 foundUser.downloads.push(download);
//                 foundUser.save();
//             }
//         })
//         res.redirect("/downloads");
//     });


//----------------------------------------------------------------------------//
//-------------------Downloads - Update Form Route-----------------------------//
//----------------------------------------------------------------------------//
router.get("/downloads/:id/edit", isLoggedIn, isTeacherOrAdmin, async function (req, res) {
    var download = await Download.findById(req.params.id);
    console.log(download);
    if (!download) {
        req.flash("error", err.message);
        res.redirect("/downloads");
    }
    if (req.user._id.toString() === download.author.id.toString() || loggedUser.isAdmin === true) {
        res.render("index2", { download: download, page: "downloads_updateform", title: "Document Update Form" });
        // res.render("downloads/updateform", {download:download});
    } else {
        req.flash("error", 'To edit you must be the owner of the document.');
        res.redirect("/downloads");
    };
});

//----------------------------------------------------------------------------//
//-------------------Downloads - Update Put Route-----------------------------//
//----------------------------------------------------------------------------//
router.put("/downloads/:id", isLoggedIn, upload.single('document'), async function (req, res) {
    var loggedUser = await User.findById(req.user._id);
    Download.findById(req.params.id, async function (err, foundDownload) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            console.log(loggedUser);
            console.log(foundDownload);
            if (req.user._id.toString() === foundDownload.author.id.toString() || loggedUser.isAdmin === true) {
                if (req.file) {
                    await fs.unlink(foundDownload.file[0].url, (err) => {
                        console.log(err);
                    });
                    for (let oldFile of foundDownload.file) {
                        let index = foundDownload.file.indexOf(oldFile);
                        await foundDownload.file.splice(index, 1);
                    };
                    foundDownload.file.push({
                        url: req.file.path,
                        // public_id: doc.public_id
                    });

                }
                foundDownload.author.username = req.user.username;
                foundDownload.title = req.body.download.title;
                foundDownload.description = req.body.download.description;
                foundDownload.topic = req.body.download.topic;
                foundDownload.exam = req.body.download.exam;
                foundDownload.attempt = req.body.download.attempt;
                foundDownload.subject = req.body.download.subject;
                await foundDownload.save();
                req.flash("success", "Successfully Updated!");
                res.redirect("/downloads");
            };
        };
    });
});

//OLD CLOUDINARY

// router.put("/downloads/:id", upload.single('document'), function(req, res) {
//     Download.findById(req.params.id, async function(err, foundDownload){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             if(req.file){
//                 for(let oldFile of foundDownload.file){
//                     console.log(oldFile.public_id);
//                     await cloudinary.uploader.destroy(oldFile.public_id, function(error, result){
//                             console.log(result, error);
//                     });
//                     let index = foundDownload.file.indexOf(oldFile);
// 					 foundDownload.file.splice(index, 1);
// 		      }

// 				let docUpdated = await cloudinary.uploader.upload(req.file.path,
// 				{resource_type: "raw",
//                  use_filename : "true",
//                  unique_filename: "false",
//                 }, function(error, result){
//                     console.log(result,error);
//                 });
// 				foundDownload.file.push({
// 					url: docUpdated.secure_url,
// 					public_id: docUpdated.public_id
// 				});
//                 }


//             foundDownload.author.username = req.user.username;
//             foundDownload.title = req.body.download.title;
//             foundDownload.description=req.body.download.description;
//             foundDownload.topic=req.body.download.topic;
//             foundDownload.exam=req.body.download.exam;
//             foundDownload.attempt=req.body.download.attempt;
//             foundDownload.subject=req.body.download.subject;
//             await foundDownload.save();
//             req.flash("success","Successfully Updated!");
//             res.redirect("/downloads");
//         }
//     });
// });



//----------------------------------------------------------------------------//
//------------------------Downloads - Delete - Form---------------------------//
//----------------------------------------------------------------------------//
router.delete("/downloads/:id", isLoggedIn, async function (req, res) {
    var loggedUser = User.findById(req.user._id);
    let docs = await Download.findById(req.params.id);
    console.log(req.user._id);
    console.log(docs.author.id);
    console.log(docs.file[0].url);
    if (req.user._id.toString() === docs.author.id.toString() || loggedUser.isAdmin === true) {
        await fs.unlink(docs.file[0].url, (err) => {
            if (err) {
                console.log(err)
            }
        })
        await User.findByIdAndUpdate(req.user._id, { $pull: { downloads: req.params.id } });
        console.log(docs)

        await docs.remove();
        res.redirect("back");
    } else {
        req.flash('error', "You must be the owner of the document to delete it.");
        return res.redirect('/downloads');
    }
});

//OLD CLOUDINARY METHOD
// ----------------------------
// router.delete("/downloads/:id", async function(req, res){
// await User.findByIdAndUpdate(req.user._id, {$pull:{downloads: req.params.id}});
//    let docs = await Download.findById(req.params.id);
//     for(let doc of docs.file){
//          await cloudinary.uploader.destroy(doc.public_id, function(error, result){
//              if (error) {
//                  console.log("This Error " + error);
//              } else {
//                  console.log("This result " + result);
//              }
//          });
//     }
//     await docs.remove();
//     res.redirect("back");
// });


//----------------------------------------------------------------------------//
//-----------------------------Downloads Counter------------------------------//
//----------------------------------------------------------------------------//
router.put("/download/:id/counter", (req, res) => {
    if (req.user) {
        User.findById(req.user.id, (err, foundUser) => {
            if (err) {
                console.log(err);
                return res.send(err);
            } else {
                Download.findById(req.params.id, (err, foundDownload) => {
                    if (err) {
                        console.log(err);
                    } else {
                        userDownloadData = {
                            id: foundUser,
                        };
                        Download.findByIdAndUpdate(foundDownload, 
                            { $inc: { 'downloadCounter': 1 }, $addToSet: {downloadStudents: { id: foundUser, username: foundUser.username } } }, {new:true},function (err, res) {
                            if (err) {
                                console.log(err);
                                return res.send(err);
                            } else (console.log("success"));
                        });
                        res.json([{ foundDownload }, { foundUser }]);
                    };
                });
            }
        });
    }
});

//Async Version 1.3
router.put("/user/downloads/:id/bookmark", async (req, res) => {
    try {
        let foundUser = await User.findById(req.user.id);
        if (!foundUser) { res.json([{ msg: "You need to be signed in!" }]); }
        let foundDownload = await Download.findById(req.params.id);
        var exists = foundUser.downloadBookmarks.indexOf(req.params.id);
        console.log(exists);
        if (exists !== -1 || undefined) {
            if (req.xhr) {
                res.json([{ msg: `${foundDownload.title} is already in your bookmarks. To remove please visit your dashboard.` }])
            }
            else {
                User.findByIdAndUpdate(req.user.id,
                    { $pull: { downloadBookmarks: req.params.id } }, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash("success", "Bookmark was succesfully removed")
                            res.redirect("back");
                        }
                    })
            }
        }
        else {
            // let foundDownload = await Download.findById(req.params.id);
            if (!foundDownload) { res.json([{ msg: "We encountered some issue. Please try again!" }]); }
            foundUser.downloadBookmarks.push(foundDownload);
            foundUser.save();
            if (req.xhr) {
                res.json([{ msg: `${foundDownload.title} added to your bookmarks` }]);
            } else {
                res.redirect("back");
            }
        };
    }
    catch (error) {
        req.flash("error", error.message);
        return res.render("back");
    }
});


router.get("/downloads/docs/:id", isLoggedIn, (req, res) => {
    const docId = req.params.id;
    Download.findById(req.params.id, (err, foundDocument) => {
        if (err) {
            req.flash('error', err.msg);
            res.redirect('/downloads');
        } else {
            const documentName = foundDocument.file[0].url.slice(13);
            const fileFormat = foundDocument.file[0].url.slice(-4);
            const fileName = documentName.substring(0, documentName.indexOf('_'));
            const documentLocation = path.join('uploads', 'docs', documentName)
            console.log(fileFormat);
            console.log(documentName);
            console.log(fileName);
            console.log(documentLocation);
            const file = fs.createReadStream(documentLocation);
            res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '' + fileFormat + '" ');
            file.pipe(res);
            // fs.readFile(documentLocation, (err,data)=>{
            //     if(err){
            //         console.log(err);
            //     } else {
            //         res.setHeader('Content-Disposition', 'attachment');
            //         res.send(data);
            //     }
            // })
        };
    });
});

// Main Version - 1.2

// router.put("/user/downloads/:id/bookmark", (req,res)=>{
//     User.findById(req.user.id).exec(async (err,foundUser)=>{
//         if(err){
//             console.log("No user exisiting");
//         } else  {
//            var exists = foundUser.downloadBookmarks.indexOf(req.params.id);
//            console.log(exists);
//            if(exists !== -1 || undefined){
//             User.findByIdAndUpdate(req.user.id, {
//             $pull: { downloadBookmarks: req.params.id}
//             }, function(err, result){
//                 if(err){console.log(err)} else {
//                     res.json([{msg:"Removed from your bookmarks"}])}
//             });
//         } else {
//             Download.findById(req.params.id,(err, foundDownload)=>{
//                 if(err){
//                     req.flash("err","Some issues. Please try again");
//                 } else {
//                     foundUser.downloadBookmarks.push(foundDownload);
//                     foundUser.save();
//                     res.json([{msg:"Added to your bookmarks"}]);
//                 }; 
//             });
//         };
//        };
//     })
// }); 



// Version 1.0
// router.put("/user/downloads/:id/bookmark", (req,res)=>{

//     User.findById(req.user.id, (err, foundUser)=>{
//         if(err){
//            console.log(err);
//            return  res.send(err);
//         }  else {
//             Download.findById(req.params.id,(err,foundDownload)=>{
//                 if(err){
//                     console.log(err);
//                 } else {
//                     if(foundUser.downloadBookmarks.includes(foundDownload.id)){
//                         User.findByIdAndUpdate(req.user.id, {
//                             $pull: { downloadBookmarks: foundDownload }
//                         })} else {
//                             foundUser.downloadBookmarks.push(foundDownload);
//                             foundUser.save();
//                         }; 
//                     res.json([{foundDownload}, {foundUser}]);
//                 };   
//               });
//             };
//         });     
//     }); 

//----------------------------------------------------------------------------//
//----------------------Downloads - Share-Landing Page------------------------//
//----------------------------------------------------------------------------//
router.get('/downloads/:id', async(req, res)=>{
    try
    {
        var document = await Download.findById(req.params.id);
        console.log(document.author.id);
        var authorid = await User.findById(document.author.id);
        // res.redirect('/teachers/'+authorid)
    // var author = User.findById(document.author.id);
    if(!document){
        req.flash('error', 'Please try again');
        res.redirect('/downloads');
    }
    // res.redirect('/teachers/' + author.id);
    var documentName = document.file[0].url.slice(13);
    var fileFormat = document.file[0].url.slice(-4);
    var fileName = documentName.substring(0, documentName.indexOf('_'));
    var documentLocation = path.join('uploads', 'docs', documentName)
    console.log(fileFormat);
    console.log(documentName);
    console.log(fileName);
    console.log(documentLocation);
    var file = fs.createReadStream(documentLocation);
    res.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '' + fileFormat + '" ');
    file.pipe(res);
} catch(error){
    req.flash('error',error.message);
    res.redirect('/downloads');
}
    
    
})

module.exports = router;