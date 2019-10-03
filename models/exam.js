var mongoose = require("mongoose");

var ExamSchema = new mongoose.Schema({
    exam: String,
    subjects:[String],
    });

module.exports = mongoose.model("Exam", ExamSchema);