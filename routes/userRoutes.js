const express = require("express");
const app = express(); 

app.get("/",(req, res) => {
    console.log('rendering the home page')
    res.render("home");
});
app.get("/login",(req, res) => {
    console.log('rendering the home page')
    res.render("login");
});
app.get("/signup",(req, res) => {
    console.log('rendering the home page')
    res.render("signup");
});


module.exports = app;