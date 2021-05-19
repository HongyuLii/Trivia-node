var express = require("express");
var router  = express.Router({mergeParams: true}); //
var User = require("../models/user");
var middleware = require("../middleware");

//SHOW - shows more info about one questions
router.get("/:id", function(req, res){
    //find the question with provided ID
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            console.log(req.params.id)
            //render show template with that question
            res.render("users/show", {user: foundUser});
        }
    });
});

module.exports = router;