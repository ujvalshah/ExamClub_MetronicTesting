var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var mongoosePaginate = require('mongoose-paginate');



var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName:{type:String, required: true},
    lastName:{type:String, required: true},
    dob:{type: Date},
    exam:{type:String},
    image: String,
    description: String,
    location: String,
    address: String,
    city: {type:String},
    state: {type:String},
    pincode: {type:String},
    mobile: { type: String},
    workmobile: { type: String},
    email: {type:String, unique: true, required: true},
    workemail: {type:String},
    emailVerified : {type: Boolean, default: false},
    emailverificationToken : String,
    emailVerificationexpiry: Date,
    workprofile: String,
    subject: [String],
    videos:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
        }],    
    downloads:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Download"
        }],    
    videoBookmarks:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
        }],    
    downloadBookmarks:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Download"
        }],
    accountCreated :{ type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires:Date,
    isAdmin: {type: Boolean, default: false},
    isFaculty: {type: Boolean, default: false},
    isFacultyVerified: {type: Boolean, default: false},
    isStudent: {type: Boolean, default: false},
    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notificationscopy'
    	}
    ],
    followers: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User',
    	}
    ],
    following: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User',
    	}
    ],
},{timestamps:true,});

UserSchema.plugin(passportLocalMongoose, {
    usernameQueryFields: ["email"]
});


UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("User", UserSchema);