var mongoose = require("mongoose");


var TeacherSchema = new mongoose.Schema({    
    name: {type:String, unique: true},
    username: String,
    firstName: String,
    lastName : String,
    displayName : String,
    byAdmin: {type:Boolean},
});

module.exports = mongoose.model("Teacher", TeacherSchema);