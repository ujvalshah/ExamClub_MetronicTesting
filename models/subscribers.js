const mongoose = require("mongoose");


const  SubscriberSchema = new mongoose.Schema({
    email: {type:String, unique: true},
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);