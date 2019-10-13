//Nax Section 5-25//

var Download = require("../models/download.js");
var Video = require("../models/video.js");
var User = require("../models/user.js");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'Only site admins can access this section of the website.');
      res.redirect('back');
    }
  },
    isFaculty: function(req, res, next) {
    if(req.user.isFaculty) {
      next();
    } else {
      req.flash('error', 'You need to be signed in as a teacher!');
      res.redirect('back');
    }
  },
    isStudent: function(req, res, next) {
    if(req.user.isStudent) {
      next();
    } else {
      req.flash('error', 'You need to be signed in as a student!');
      res.redirect('back');
    }
  },
  
    isTeacherOrAdmin: function(req, res, next) {
    if(req.user.isFaculty === true || req.user.isAdmin === true) {
      next();
    } else {
      req.flash('error', 'You should be a teacher or an admin to access this feature!');
      res.redirect('back');
    }
  },

  isEmailVerified: function(req, res, next) {
    if(req.user && req.user.emailVerified === false) {
      req.flash('emailVerification', {subject:'emailNotVerified', message:'Email Verification Pending'});
      res.redirect('/email-verification');
    } else {
      next();
    }
  },
  

  isFacultyVerified: function(req, res, next) {
    if(req.user && req.user.isFaculty && req.user.isFacultyVerified === false) {
      req.logout();
      req.flash('warning',`Your faculty account needs to be approved by the admin before you can access it.
      Usually it takes 2-3 hours to get approved. Please wait till then.
      For any further enquiries email at caexamclub@gmail.com.`)
      res.redirect('/login');
    } else {
      next();
    }
  },


//----------------------------------------------------------------------------//
//------------------------------Document Filter-------------------------------//
//----------------------------------------------------------------------------//

async searchAndFilterDocs(req,res,next) {
    
  // pull keys from req.query (if there are any) and assign them 
  // to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      
      
  // check if queryKeys array has any values in it
  // if true then we know that req.query has properties
  // which means the user => submitted the search/filter form
      if(queryKeys.length){
        const dbQueries = [];
        
        let { search, exam, attempt, subject, author } = req.query;
        
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {exam: search},
            {attempt: search},
            {subject: search},
            {title: search},
            {description: search},
            {topic: search},
            {'author.username': search},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        console.log(!exam.includes("All"));
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(subject && !subject.includes("All") && !subject.includes("rf")){
        dbQueries.push({subject: {$in: subject}});
      }  else if (subject && subject.includes("All") && !subject.includes("rf")){
          subject = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({subject:{$in:subject}});
      } else if (subject && subject.includes("rf") && dbQueries.indexOf({subject:{$in:subject}}) !== -1){
        console.log(subject);
        console.log(dbQueries.indexOf({subject:{$in:subject}}));
          dbQueries.splice(dbQueries.indexOf({subject:{$in:subject}}),1);
      }
      
      if(attempt && !attempt.includes("All") && !attempt.includes("rf")){
        dbQueries.push({attempt:{$in: attempt}});
      } else if (attempt && attempt.includes("All") && !attempt.includes("rf")){
        attempt = ["Nov 2019", "May 2020", "Nov 2020", "May 2021", "Nov 2021"];
          dbQueries.push({attempt:{$in:attempt}});
      } else if (attempt && attempt.includes("rf") && dbQueries.indexOf({attempt:{$in:attempt}}) !== -1){
        dbQueries.splice(dbQueries.indexOf({attempt:{$in:attempt}}),1);
      }

      if(author && author !== 'rf'){
        dbQueries.push({'author.username': author});
      }
        

      res.locals.docdbQuery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.docquery = req.query;
      console.log('DOC QUERY queryKeys');
      console.log(queryKeys);
      console.log(queryKeys.length);

      queryKeys.splice(queryKeys.indexOf('page'),1);
      const delimiter = queryKeys.length ? '&' : '?';
      res.locals.docspaginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g,'') + `${delimiter}`;

      // res.locals.filterUrl = req.originalUrl;
      next();
    },

//----------------------------------------------------------------------------//
//------------------------------Video Filter(Copy)----------------------------------//
//----------------------------------------------------------------------------//
async searchAndFilterVideoCopy(req,res,next) {
      
  // pull keys from req.query (if there are any) and assign them 
	// to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      
      
  // check if queryKeys array has any values in it
	// if true then we know that req.query has properties
	// which means the user => submitted the search/filter form
      if(queryKeys.length){
	  	  const dbQueries = [];
	  	  
	  	  let {search, exam, attempt, subject, author } = req.query;
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {exam: search},
            {attempt: search},
            {subject: search},
            {title: search},
            {description: search},
            {topic: search},
            {'author.username': search},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        console.log(!exam.includes("All"));
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(subject && !subject.includes("All") && !subject.includes("rf")){
        dbQueries.push({subject: {$in: subject}});
      }  else if (subject && subject.includes("All") && !subject.includes("rf")){
         subject = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({subject:{$in:subject}});
      } else if (subject && subject.includes("rf") && dbQueries.indexOf({subject:{$in:subject}}) !== -1){
        console.log(subject);
        console.log(dbQueries.indexOf({subject:{$in:subject}}));
         dbQueries.splice(dbQueries.indexOf({subject:{$in:subject}}),1);
      }
      
      if(attempt && !attempt.includes("All") && !attempt.includes("rf")){
        dbQueries.push({attempt:{$in: attempt}});
      } else if (attempt && attempt.includes("All") && !attempt.includes("rf")){
        attempt = ["Nov 2019", "May 2020", "Nov 2020", "May 2021", "Nov 2021"];
         dbQueries.push({attempt:{$in:attempt}});
      } else if (attempt && attempt.includes("rf") && dbQueries.indexOf({attempt:{$in:attempt}}) !== -1){
        dbQueries.splice(dbQueries.indexOf({attempt:{$in:attempt}}),1);
      }

      if(author && author !== 'rf'){
        dbQueries.push({'author.username': author});
      }
      
      res.locals.dbQuery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.videoquery = req.query;
      console.log('VideoQuery queryKeys');
      console.log(queryKeys);
      console.log(queryKeys.length);
      // if(videoquery){
      //   console.log(videoquery);
      //   console.log(videoquery.length);
      // }

      queryKeys.splice(queryKeys.indexOf('page'),1);
      const delimiter = queryKeys.length ? '&' : '?';
      res.locals.videospaginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g,'') + `${delimiter}`;
      res.locals.limitUrl = req.originalUrl.replace(/(\?|\&)limit=\d+/g,'') + `${delimiter}`;

      // res.locals.filterUrl = req.originalUrl;
      next();
    },


//----------------------------------------------------------------------------//
//------------------------------Video Filter----------------------------------//
//----------------------------------------------------------------------------//
  async searchAndFilterVideo(req,res,next) {
      
  // pull keys from req.query (if there are any) and assign them 
	// to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      
      
  // check if queryKeys array has any values in it
	// if true then we know that req.query has properties
	// which means the user => submitted the search/filter form
      if(queryKeys.length){
	  	  const dbQueries = [];
	  	  
	  	  let { search, exam, attempt, subject } = req.query;
        
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {exam: search},
            {attempt: search},
            {subject: search},
            {title: search},
            {description: search},
            {topic: search},
            {'author.username': search},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        console.log(!exam.includes("All"));
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(subject && !subject.includes("All") && !subject.includes("rf")){
        dbQueries.push({subject: {$in: subject}});
      }  else if (subject && subject.includes("All") && !subject.includes("rf")){
         subject = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({subject:{$in:subject}});
      } else if (subject && subject.includes("rf") && dbQueries.indexOf({subject:{$in:subject}}) !== -1){
        console.log(subject);
        console.log(dbQueries.indexOf({subject:{$in:subject}}));
         dbQueries.splice(dbQueries.indexOf({subject:{$in:subject}}),1);
      }
      
      if(attempt && !attempt.includes("All") && !attempt.includes("rf")){
        dbQueries.push({attempt:{$in: attempt}});
      } else if (attempt && attempt.includes("All") && !attempt.includes("rf")){
        attempt = ["Nov 2019", "May 2020", "Nov 2020", "May 2021", "Nov 2021"];
         dbQueries.push({attempt:{$in:attempt}});
      } else if (attempt && attempt.includes("rf") && dbQueries.indexOf({attempt:{$in:attempt}}) !== -1){
        dbQueries.splice(dbQueries.indexOf({attempt:{$in:attempt}}),1);
      }
        
      res.locals.dbQuery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.query = req.query;
      res.locals.filterUrl = req.originalUrl;
      next();
    },


//----------------------------------------------------------------------------//
//------------------------------Faculty Filter-------------------------------//
//----------------------------------------------------------------------------//

async searchAndFilterFaculty(req,res,next) {
  
  // pull keys from req.query (if there are any) and assign them 
  // to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      console.log('faculty queryKeys')
      console.log(queryKeys)
      
  // check if queryKeys array has any values in it
  // if true then we know that req.query has properties
  // which means the user => submitted the search/filter form
      if(queryKeys.length){
        const dbQueries = [{isFaculty:true}];
        
        let { search, username, firstName, lastName, exam, city, state, emailVerified } = req.query;
        
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {username: search},
            {firstName: search},
            {lastName: search},
            {exam: search},
            {city: search},
            {state: search},
            // {emailVerified: {$eq:search}},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(city && !city.includes("All") && !city.includes("rf")){
        dbQueries.push({city: {$in: city}});
      }  else if (city && city.includes("All") && !city.includes("rf")){
          city = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({city:{$in:city}});
      } else if (city && city.includes("rf") && dbQueries.indexOf({city:{$in:city}}) !== -1){
        console.log(city);
        console.log(dbQueries.indexOf({city:{$in:city}}));
          dbQueries.splice(dbQueries.indexOf({city:{$in:city}}),1);
      }
      
      if(emailVerified && emailVerified=='true'){
        dbQueries.push({emailVerified:{$eq: true}});
      } else if(emailVerified && emailVerified=='false'){
        dbQueries.push({emailVerified:{$eq: false}});
      }
        
      // if(emailVerified && !emailVerified === "rf"){
      //   dbQueries.push({emailVerified:{$eq: true}});
      // } else if(emailVerified && !emailVerified === "rf"){
      //   dbQueries.push({emailVerified:{$eq: false}});
      // }
      // else if (emailVerified && emailVerified==="rf" && dbQueries.indexOf({emailVerified:{$eq:emailVerified}}) !== -1){
      //   dbQueries.splice(dbQueries.indexOf({emailVerified:{$eq:emailVerified}}),1);
      // }
        
      res.locals.facultydbquery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.facultyquery = req.query;
      queryKeys.splice(queryKeys.indexOf('page'),1);
      const delimiter = queryKeys.length ? '&' : '?';
      res.locals.facultypaginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g,'') + `${delimiter}`;

      // res.locals.filterUrl = req.originalUrl;
      next();
    },

//----------------------------------------------------------------------------//
//------------------------------Student Filter-------------------------------//
//----------------------------------------------------------------------------//

async searchAndFilterStudent(req,res,next) {
  
  // pull keys from req.query (if there are any) and assign them 
  // to queryKeys variable as an array of string values
      const queryKeys =  Object.keys(req.query);
      console.log('student queryKeys')
      console.log(queryKeys)
      
  // check if queryKeys array has any values in it
  // if true then we know that req.query has properties
  // which means the user => submitted the search/filter form
      if(queryKeys.length){
        const dbQueries = [{isStudent:true}];
        
        let { search, username, firstName, lastName, exam, city, state, emailVerified } = req.query;
        
        if(search){
          search = new RegExp(escapeRegExp(search), 'gi');
          dbQueries.push({ $or: [
            {username: search},
            {firstName: search},
            {lastName: search},
            {exam: search},
            {city: search},
            {state: search},
            // {emailVerified: {$eq:search}},
            ]});
        }
      
      if(exam && !exam.includes("All") && !exam.includes("rf")){
        dbQueries.push({exam: {$in: exam}});
        } else if(exam && exam.includes("All") && !exam.includes("rf")){
          exam = ["CA Final(New)", "CA Final(Old)", "CA Intermediate(New)", "CA IPCC(Old)", "CA Foundation(New)"];
          dbQueries.push({exam:{$in:exam}});
        } else if (exam && exam.includes("rf")&& dbQueries.indexOf({exam:{$in:exam}}) !== -1) {
            dbQueries.splice(dbQueries.indexOf({exam:{$in:exam}}),1);
        }
      
      if(city && !city.includes("All") && !city.includes("rf")){
        dbQueries.push({city: {$in: city}});
      }  else if (city && city.includes("All") && !city.includes("rf")){
          city = ["CA Final - P1: Financial Reporting","CA Final - P2: Strategic Financial Management", "CA Final - P3: Advanced Auditing and Professional Ethics", "CA Final - P4: Corporate & Economic Laws", "CA Final - P5: Strategic Cost Management and Performance Evaluation", "CA Final - P6A: Risk Management", "CA Final - P6B: Financial Services & Capital Markets", "CA Final - P6C: International Taxation", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6E: Global Financial Reporting Standards", "CA Final - P6F: Multi-disciplinary Case Study", "CA Final - P7: Direct Tax Laws & International Taxation", "CA Final - P8: Indirect Tax Laws"];
          dbQueries.push({city:{$in:city}});
      } else if (city && city.includes("rf") && dbQueries.indexOf({city:{$in:city}}) !== -1){
        console.log(city);
        console.log(dbQueries.indexOf({city:{$in:city}}));
          dbQueries.splice(dbQueries.indexOf({city:{$in:city}}),1);
      }
      
      if(emailVerified && emailVerified=='true'){
        dbQueries.push({emailVerified:{$eq: true}});
      } else if(emailVerified && emailVerified=='false'){
        dbQueries.push({emailVerified:{$eq: false}});
      }


      res.locals.studentdbquery = dbQueries.length ? {$and : dbQueries} : {};
      }
      
      res.locals.studentquery = req.query;
      queryKeys.splice(queryKeys.indexOf('page'),1);
      const delimiter = queryKeys.length ? '&' : '?';
      res.locals.studentpaginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g,'') + `${delimiter}`;

      next();
    }
};
