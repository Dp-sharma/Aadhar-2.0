const express = require("express");
const app = express(); 
const controllers = require('../controllers/login_controller');

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
console.log("bug marked");
app.post('/sign-up', controllers.Participant_register);


module.exports = app;