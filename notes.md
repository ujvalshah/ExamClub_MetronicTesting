<!--PAGINATION CODE Page numbers-->
<!--<div class="my-5">-->
<!--    <% if(videos.page-1){%>-->
<!--        <a href="/videos?page=<%=videos.page -1 %>">Prev</a>-->
<!--    <%}%>-->
    
<!--    <% for(let i=1; i<=videos.pages; i++){%>-->
<!--        <a href="/videos?page=<%=i%>" <%= (i===videos.page) ? "style = color:#000" : "" %>-->
<!--        ><%=i%></a>-->
<!--    <%}%>-->
    
<!--    <% if(videos.page+1 <= videos.pages){%>-->
<!--        <a href="/videos?page=<%=videos.page +1 %>">Next</a>-->
<!--    <%}%>-->
    
<!--</div>-->

<span class="glyphicon"><i class="fas fa-file-download"></i></span>
router.route('/')
 .get(helpers.getTodos)
 .post('/', function(req, res){
  db.Todo.create(req.body)
  .then(function(newTodo){
      res.status(201).json(newTodo);
  })
  .catch(function(err){
      res.send(err);
  })
})

exports.getTodos = function(req, res){
    db.Todo.find()
    .then(function(todos){
        res.json(todos);
    })
    .catch(function(err){
        res.send(err);
    })
}


<a href="#"><span class="pr-2"><i class="fas fa-thumbs-up"></i></span></a> 
<a href="#" title="Share"><span class="pr-2"><i class="fas fa-share-alt"></i></span></a>'					


else if(!currentUser){%>
               <form id="save-video-form" class="d-inline float-right" action="#">
                  <button type="submit" class="btn btn-warning btn-sm ml-1 student-alert">Bookmark</button>
              </form>
              <%}%>
              
              
              
               else if(currentUser && currentUser.isStudent && currentUser.videos.includes(video.id)){%>
              <form id="unsave-video-form" class="d-inline float-right" action="#">
                  <button type="submit"  class="btn btn-info btn-sm ml-1">Bookmarked</button>
              </form>
              <%} 
              
              
              
              $(document).ready( function(){

   });
   
   <a href="#"><span class="pr-2"><i class="fas fa-thumbs-up"></i></span></a>
   
   
   //----------------------------------------------------------------------------//
//-------------------------------Forgor Password------------------------------//
//----------------------------------------------------------------------------//
router.get("/forgot-password", (req,res)=>{
    res.render("forgot");
});


router.put("/forgot-password", async (req,res)=>{
    try{
    let {email} = req.body;
    let user = await User.findOne({email: req.body.email});
    // user.resetPasswordToken = null;
    // user.resetPasswordExpires = null;
    let token = await crypto.randomBytes(20).toString('hex');
    if(!user){
        req.flash("error","No account with that email.");
        return res.redirect("/forgot-password");
    } 
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1hr
    await user.save();
    const passForgotMail = {
              to: email,
              from: 'caexamclub@gmail.com',
              subject: 'Exam Club - Forgot Password/Reset',
              text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			  Please click on the following link, or copy and paste it into your browser to complete the process:
			  http://${req.headers.host}/reset/${token}
			  If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			  /g, ''),
            //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
    await sgMail.send(passForgotMail);
    req.flash("success", `An e-mail has been sent to ${user.email} with further instructions.`);
    res.redirect("/forgot-password");
    } catch(err){
        req.flash("error", err.message);
        return res.redirect("/forgot-password");
    }
});


 

   <div class="col-md-4 card_video">
      <div class="card">
          <div class="embed-responsive embed-responsive-16by9 card-img-top">
            <iframe width="560" height="315" class="embed-responsive-item" src="<%=video.url%>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        <div class="card-body">
          <h6 class="card-title"><%=video.title%></h6>
          <small><span class="text-primary">Faculty:</span> <span class="text-capitalize"><%=video.author.username=== undefined ? "none" :  video.author.username%></span></small>
          <p><small class="card-text"><span class="text-primary">Description:</span> <%-video.description.substring(0, 100) %>...</small></p>
          <small class="card-text"><span class="text-primary">Applicable to:</span><%=video.exam%> </small> <br>
          <small class="card-text"><span class="text-primary">Applicable attempts:</span> <%=video.attempt%></small>
        </div>
        <div class="card-footer">
          <small class="text-muted">Upload: <%=video.createdAt.toDateString()%></small> 
          <form  class="d-inline float-right rmBookmark-video-form" action="/user/<%=currentUser._id%>/videos/<%=video._id%>?_method=PUT" method="POST">
              <button type="submit" class="btn btn-sm ml-1 btn-info video-student-unbookmark-button" 
              onclick="return confirm('Are you sure you want to remove this item from your bookmarks?')">Bookmarked</button>
          </form>
        </div>
      </div>
      </div>


      <div class="col-md-4 card_video">
                  <div class="card">
                      <div class="embed-responsive embed-responsive-16by9 card-img-top">
                        <iframe width="560" height="315" class="embed-responsive-item" src="<%=video.url%>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </div>
                  <div class="card-body">
                      <h6 class="card-title"><%=video.title%></h6>
                      <span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--bold kt-hidden-"><%=video.author.username.charAt(0).toUpperCase()%></span>
                      <span class="text-capitalize small"><%=video.author.username%></span>
                      <p class="card-text small"><span class="text-primary">Applicable to: </span><span
                        class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill kt-badge--bold"  data-toggle="tooltip" data-placement="bottom" title="Applicable Exam"><%=video.exam%></span> <span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill kt-badge--bold" data-toggle="tooltip" data-placement="bottom" title="Applicaple Attempt" ><%=video.attempt%></span></p>
                      <p><small class="card-text"><span class="text-primary">Description:</span> <%-video.description.substring(0, 100) %>...</small></p>
                  </div>
                  <div class="card-footer">
                      <!-- <small class="text-muted"><%=video.createdAt.toDateString()%></small>  -->
                      <a class="btn btn-primary btn-sm ml-4" href="/videos/<%=video._id %>/edit" role="button">Edit</a>
                      <form class="delete-video-form float-right" action="/videos/<%=video._id%>?_method=DELETE" method="POST">
                          <button type="submit" class="btn btn-danger btn-sm ml-1">Delete</button>
                      </form>
                  </div>
                  </div>
                </div>