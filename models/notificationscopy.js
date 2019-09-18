const mongoose = require("mongoose");

const NotificationcopySchema = new mongoose.Schema({
    message: String,
    uploader: String,
    exam: String,
    isRead: { type: Boolean, default: false },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
        username: String,
    },
    date: { type: Date, default: Date.now }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notificationscopy", NotificationcopySchema);