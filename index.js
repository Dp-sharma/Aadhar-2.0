const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/userRoutes')
console.log("I am running ");
const app = express()
const port = 3000

// Middleware
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

console.log("MongoDB URL:", process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL)
console.log('Database connected successfully')
// Set EJS as the view engine
app.set('view engine', 'ejs');


app.use("/", routes)

app.get('/views/login.ejs', (req, res) => {
  res.render('login');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});
app.get('/prototype', (req, res) => {
  res.render('prototype');
});
app.get('/finalReport', (req, res) => {
  res.render('finalReport');
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})