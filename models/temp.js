var mongoose = require("mongoose");

var TempSchema = new mongoose.Schema({
    name: String,
    tempname: String,
    path: String,
    },{timestamps:true});

module.exports = mongoose.model("Temp", TempSchema);