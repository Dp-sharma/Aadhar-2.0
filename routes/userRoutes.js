const express = require("express");
const app = express(); 
const controllers = require('../controllers/login_signup_controller');
const olduserauth = require("../middleware/olduserauth");
const auth = require("../middleware/auth");
const { updateProfile } = require("../controllers/complete_your_profile_controller");
const profile_complete = require("../middleware/profile_complete");

app.get("/",(req, res) => {
    console.log('rendering the home page')
    res.render("home");
});
app.get("/home",(req, res) => {
    console.log('rendering the home page')
    res.render("home");
});
app.get("/login",(req, res) => {
    console.log('rendering the login page')
    res.render("login");
},auth);
app.get("/signup",(req, res) => {
    console.log('rendering the signup page')
    res.render("signup");
});
app.get('/profile',auth,profile_complete, (req, res) => {
  res.render('complete_your_profile', { user: req.participant }); // Pass the user data to the EJS template
  },);

  app.get('/prototype',auth, (req, res) => {
    res.render('prototype');
  });
  app.get('/finalReport',olduserauth, (req, res) => {
    res.render('finalReport');
  });
  app.get('/logout', (req, res) => {
    res.clearCookie('jwtoken'); // Clears the JWT cookie
    res.redirect('/login'); // Redirect to login page after logout
  });
  //Create a get for userprofile 
  app.get("/userProfile", auth, (req, res) => {
    res.render("userProfile", { user: req.participant });
  });
  //create a get request to about section
  app.get("/about",(req, res) => {
    console.log('rendering the about page')
    res.render("about");
});
app.post('/update_profile',auth,updateProfile);
app.post('/sign-up', controllers.Participant_register);
app.post('/login', controllers.Participant_login);


module.exports = app;