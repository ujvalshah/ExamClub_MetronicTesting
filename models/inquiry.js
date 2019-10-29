const mongoose = require("mongoose");


const  InquirySchema = new mongoose.Schema({
    name: String,
    mobile: Number,
    email: String,
    message: String,

});

module.exports = mongoose.model("Inquiry", InquirySchema);