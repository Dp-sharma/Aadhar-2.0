const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const routes = require('./routes/userRoutes')
const app = express()
const port = 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Set EJS as the view engine
app.set('view engine', 'ejs');


app.use("/", routes)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})