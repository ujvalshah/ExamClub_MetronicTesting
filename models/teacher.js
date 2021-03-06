var mongoose = require("mongoose");


var TeacherSchema = new mongoose.Schema({    
    displayName: String,
    byAdmin: {type:Boolean},
    registeredUser:
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        }, 
    username: String,    
});

module.exports = mongoose.model("Teacher", TeacherSchema);