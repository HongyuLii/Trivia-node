var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Question  = require("./models/question"),
    Answer     = require("./models/answer"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")    

//requiring routes
var answerRoutes    = require("./routes/answers"),
    questionRoutes = require("./routes/questions"),
    indexRoutes      = require("./routes/index")
    userRoutes     =require("./routes/users")

// seedDB(); seed the db
mongoose.connect("mongodb://localhost/trivia_test_4", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); // for editing and updating
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
    secret: "cuetest dog",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });

app.use("/", indexRoutes);
app.use("/questions", questionRoutes);
app.use("/questions/:id/answers", answerRoutes);
app.use("/users", userRoutes)

app.listen(3000, function(){
    console.log("Trivia Server Has Started!");
});