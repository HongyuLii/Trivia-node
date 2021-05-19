var Question = require("../models/question");
var Answer = require("../models/answer");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkQuestionOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Question.findById(req.params.id, function(err, foundQuestion){
           if(err){
               req.flash("error", "Question not found");
               res.redirect("back");
           }  else {
               // does user own the question?
            if(foundQuestion.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkAnswerOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Answer.findById(req.params.answer_id, function(err, foundAnswer){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the answer?
            if(foundAnswer.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;