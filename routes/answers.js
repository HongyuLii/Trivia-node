var express = require("express");
var router  = express.Router({mergeParams: true}); //
var Question = require("../models/question");
var Answer = require("../models/answer");
var middleware = require("../middleware");

//Answers new
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find question by id
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else {
             res.render("answers/new", {question: question});
        }
    })
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup question using ID
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.redirect("/questions");
        } else {
         Answer.create(req.body.answer, function(err, answer){
            if(err){
                req.flash("error", "Something went wrong!");
                console.log(err);
            } else {
               //add username and id to answer
               answer.author.id = req.user._id;
               answer.author.username = req.user.username;
               //change score
               console.log(question.answers);
               question.answers.forEach(function(answer_in_question){
                   console.log(answer_in_question.text)
                   if (answer_in_question.text == answer.text) {
                        // console.log(answer_in_question)
                        answer_in_question.author.score++;
                   }
               })
               //save answer
               answer.save();
               question.answers.push(answer);
               console.log(question.answers);
               console.log(answer)
               question.save();
               req.flash("success", "Successfully added answer!")
               res.redirect('/questions/' + question._id);
            }
         });
        }
    });
 });

 // COMMENT EDIT ROUTE
router.get("/:answer_id/edit", middleware.checkAnswerOwnership, function(req, res){
    Answer.findById(req.params.answer_id, function(err, foundAnswer){
       if(err){
           res.redirect("back");
       } else {
         res.render("answers/edit", {question_id: req.params.id, answer: foundAnswer});
       }
    });
 });
 
 // COMMENT UPDATE
 router.put("/:answer_id", middleware.checkAnswerOwnership, function(req, res){
    Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err, updatedAnswer){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/questions/" + req.params.id );
       }
    });
 });
 
 // COMMENT DESTROY ROUTE
 router.delete("/:answer_id", middleware.checkAnswerOwnership, function(req, res){
     //findByIdAndRemove
     Answer.findByIdAndRemove(req.params.answer_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted answer!")
            res.redirect("/questions/" + req.params.id);
        }
     });
 });


module.exports = router;