var express = require("express");
var router  = express.Router(); //
var Question = require("../models/question");
var middleware = require("../middleware");

//INDEX
router.get("/", function(req, res){
    // Get all questions from DB
    Question.find({}, function(err, allQuestions){
        if(err){
            console.log(err);
        } else {
           res.render("questions/index",{questions:allQuestions});
        }
     });
});

//CREATE, ADD NEW TO THE DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to question array
    var text = req.body.text;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newQuestion = {text:text, author: author};

    //Create a new question and save to db
    Question.create(newQuestion, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else{
            //redirect back to question page
            console.log(newlyCreated); //print in terminal
            res.redirect("/questions");
        }
    });
});

//new form to 
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("questions/new")
});//show the form that will send the data to pot route

//SHOW - shows more info about one questions
router.get("/:id", function(req, res){
    //find the question with provided ID
    Question.findById(req.params.id).populate("answers").exec(function(err, foundQuestion){
        if(err){
            console.log(err);
        } else {
            // console.log(foundQuestion)
            //render show template with that question
            res.render("questions/show", {question: foundQuestion});
        }
    });
});

module.exports = router;