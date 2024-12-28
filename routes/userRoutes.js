const express = require("express");
const app = express(); 
const controllers = require('../controllers/login_signup_controller');

app.get("/",(req, res) => {
    console.log('rendering the home page')
    res.render("home");
});
app.get("/login",(req, res) => {
    console.log('rendering the login page')
    res.render("login");
});
app.get("/signup",(req, res) => {
    console.log('rendering the signup page')
    res.render("signup");
});

app.post('/sign-up', controllers.Participant_register);
app.post('/login', controllers.Participant_login);


module.exports = app;