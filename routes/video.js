var express = require("express");
var router = express.Router();
var Video = require("../models/video.js");
var User = require("../models/user.js");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin, isFaculty, isStudent, isTeacherOrAdmin, searchAndFilterVideo, searchAndFilterVideoCopy } = middleware;

//----------------------------------------------------------------------------//
//------------------------------Video Routes----------------------------------//
//----------------------------------------------------------------------------//

//----------------------------CA Videos Route----------------------------------//

router.get("/videos", searchAndFilterVideo, async function (req, res) {
    const { dbQuery } = res.locals;
    delete res.locals.dbQuery;
    // res.locals.query=req.query;  
    function sortFunction() {
        if (req.query.sort === "Earliest") {
            return { createdAt: 1 };
        } else if (req.query.sort === "Latest") {
            return { createdAt: -1 };
        } else if (req.query.sort === "Description-Ascending") {
            return { description: 1 };
        } else if (req.query.sort === "Description-Descending") {
            return { description: -1 };
        } else {
            return { createdAt: -1 };
        }
    }
    Video.find(dbQuery, null, { sort: sortFunction() }, function (err, foundVideo) {
        if (err) {
            res.redirect("back");
        } else {
            console.log('----------');
            console.log(res.locals.query);
            console.log('----------');
            if (!foundVideo.length && res.locals.query) {
                res.locals.error = 'No results match that query.';
                // req.flash("error", 'No results match that query.');
                // res.redirect("/videos");
            }
            if (req.xhr) {
                res.json({ videos: foundVideo });
            }
            res.render("index2", { videos: foundVideo, page: "videos", title: "Video Bank" });
            // res.render("videos/videos", {videos: foundVideo, page:"videos"});
        }
    });
});


router.get("/videoscopy", searchAndFilterVideoCopy, async function (req, res) {
    try {
        const { dbQuery, paginateUrl } = res.locals;
        delete res.locals.dbQuery;

        function sortFunction() {
            if (req.query.sort === "Earliest") {
                return { createdAt: 1 };
            } else if (req.query.sort === "Latest") {
                return { createdAt: -1 };
            } else if (req.query.sort === "Description-Ascending") {
                return { description: 1 };
            } else if (req.query.sort === "Description-Descending") {
                return { description: -1 };
            } else {
                return { createdAt: -1 };
            }
        }
        console.log('***req.query.sort****');
        console.log(req.query.sort);
        var foundVideo = await Video.paginate(dbQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            sort: req.query.sort || '-createdAt',
        });
        // ************Found Video********  ******

        console.log('req.query.page');
        console.log(req.query.page);
        if (req.xhr) {
            console.log('JSON');
            if (!foundVideo) {
                let message = "Sorry, no videos were found! Please try again or search with different Parameters!"
                res.json({ message });
            } else {
                if (req.user) {
                    foundVideo.pageUrl = paginateUrl;
                    let currentUser = await User.findById(req.user._id);
                    if (!currentUser) { console.log(err) };
                    foundVideo.currentUser = currentUser;
                    return res.json(foundVideo);
                } else {
                    foundVideo.pageUrl = paginateUrl;
                    return res.json(foundVideo);
                }
            }
        } else {
            if (!foundVideo) {
                req.flash('error', "Sorry, no videos were found! Please try again or search with different Parameters!");
                res.redirect('back');
            } else {
                res.render("index2", { videos: foundVideo, page: "videoscopy", title: "Video Bank" });
            }
        };
    }
    catch (err) {
        console.log(err);
    }
});

//----------------------------------------------------------------------------//
//--------------------Create(New) Route - PAGINATION CODE---------------------//
//----------------------------------------------------------------------------//

//   router.get("/videos", function(req, res){
//       Video.paginate({}, {
//           page: req.query.page || 1,
//           limit: 3,
//       }, function (err, foundVideos){
//           if(err){
//               console.log(err)
//           } else {
//               foundVideos.page=Number(foundVideos.page);
//               res.render("videos/videos", {videos:foundVideos});
//           }
//       });
//   });       



//----------------------------------------------------------------------------//
//----------------------------Create(New) Route-------------------------------//
//----------------------------------------------------------------------------//
router.get("/videos/new", isLoggedIn, function (req, res) {
    if (req.user) {
        res.render("index2", { page: "videos_uploadform", title: "Video Upload Form" });
        // res.render("videos/uploadform");
    } else {
        res.redirect("/login");
    }

});


//----------------------------------------------------------------------------//
//--------------------------------POST Route----------------------------------//
//----------------------------------------------------------------------------//
router.post("/videos", isLoggedIn, function (req, res) {
    console.log(req.user);
    req.body.video.title = req.body.title;
    req.body.video.description = req.body.description;
    if(req.body.video.type == 'single'){
        var oldUrl = req.body.url;
        var editedOldURL = oldUrl.replace("watch?v=", "embed/");
        var newVideoURL = editedOldURL+'?rel=0&modestbranding=1';
    } else if (req.body.video.type == 'playlist'){
        var oldUrl = req.body.url;
        var editedOldURL = oldUrl.replace("watch?v=", "embed?listType=playlist&extraid=");
        var indexEditUrl = editedOldURL.replace("&index",'&extraIndex')
        var newVideoURL = indexEditUrl+'&rel=0&modestbranding=1';
    }
    req.body.video.url = newVideoURL;
    req.body.video.author = {
        username: req.user.username,
        id: req.user._id
    };

    Video.create(req.body.video, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect("/videos");
        } else {
            //redirect back to Video Index page
            User.findById(req.user._id, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    foundUser.videos.push(newlyCreated);
                    foundUser.save();
                }
            });
            res.redirect("/videos");
        }
    });
});

//----------------------------------------------------------------------------//
//------------------------------Edit Route Form-------------------------------//
//----------------------------------------------------------------------------//
router.get("/videos/:id/edit", function (req, res) {
    Video.findById(req.params.id, function (err, foundVideo) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/videos");
        } else {
            res.render("index2", { video: foundVideo, page: "videos_updateform", title: "Video Edit Form" });
            // res.render("videos/updateform", {video: foundVideo"});
        }
    })
})

//----------------------------------------------------------------------------//
//--------------------------------Update Route -------------------------------//
//----------------------------------------------------------------------------//

router.put("/videos/:id", isLoggedIn, async function (req, res) {
    let query = req.body;
    videoAuthor = req.body.video.author.username;
    let foundauthor = await User.find({'username':videoAuthor});
    console.log('foundauthor');
    console.log(foundauthor);
    console.log('query');
    console.log(query);
    console.log('req.body.author');
    console.log(req.body.video.author);
    console.log('req.body.video.author.username');
    console.log(req.body.video.author.username);
    let authorId = foundauthor[0]._id;
    var oldUrl = req.body.url;
    if(req.body.video.type == 'single'){
        var oldUrl = req.body.url;
        var editedOldURL = oldUrl.replace("watch?v=", "embed/");
        var newVideoURL = editedOldURL+'?rel=0&modestbranding=1';
    } else if (req.body.video.type == 'playlist'){
        var oldUrl = req.body.url;
        var editedOldURL = oldUrl.replace("watch?v=", "embed?listType=playlist&extraid=");
        var indexEditUrl = editedOldURL.replace("&index",'&extraIndex')
        var newVideoURL = indexEditUrl+'&rel=0&modestbranding=1';
    }
    req.body.video.url = newVideoURL;
    req.body.video.author.id = authorId;
    console.log(authorId);
    Video.findByIdAndUpdate(req.params.id, req.body.video, function (err, updatedVideo) {
        if (err) {
            req.flash("error");
            res.redirect("back");
        } else {
            res.redirect("/videos");
        }
    })
})

//----------------------------------------------------------------------------//
//--------------------------------Delete Route -------------------------------//
//----------------------------------------------------------------------------//

router.delete("/videos/:id", async function (req, res) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { videos: req.params.id } });

    Video.findByIdAndRemove(req.params.id, function (err) {
        if(req.xhr){
            res.json('Video successfully deleted!');
        } else {
            if (err) {
                req.flash("error", err.message);
                req.flash("success", "Video has been successfully deleted!");
                return res.redirect("back");
            } else {
                return res.redirect("back")
            }
        }
    })
})

module.exports = router;