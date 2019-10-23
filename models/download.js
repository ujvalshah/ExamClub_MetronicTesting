var mongoose = require("mongoose");
var User = require("./user");
var mongoosePaginate = require('mongoose-paginate');


var DownloadSchema = new mongoose.Schema({
    title: String,
    description: String,
    exam: [String],
    attempt: [String],
    subject: [String],
    topic: String,
    downloadCounter: {type:Number, default:0},
    file: [{url:String, public_id:String}],
    author: {
        id : {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User"
        },
        username: String,
        displayName: String,
    },
    downloadStudents: [{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        downloadDate: {type: Date, default: Date.now}
    }],
    date: {type: Date, default: Date.now }},
    {timestamps:true,}
);

DownloadSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Download", DownloadSchema);