var mongoose = require("mongoose");

var BatchSchema = new mongoose.Schema({
    name: String,
    url: String,
    saveid:String,
    },{timestamps:true});

module.exports = mongoose.model("Batchupload", BatchSchema);