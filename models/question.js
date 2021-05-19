var mongoose = require("mongoose");
//SCHEMA SETUP
var questionSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer"
        }
    ]
});

module.exports = mongoose.model("Question", questionSchema);