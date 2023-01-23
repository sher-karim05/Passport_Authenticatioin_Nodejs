const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const flash = require("flash");
const session = require('express-session')
const users = require('./routes/user')
const greet = require('./routes/index')
const mongoose = require('mongoose');
const passport = require('passport')
require('dotenv').config()

//Passport Config
require('./config/passport')(passport)
const db = require("./config/keys").MONGO_URI;

mongoose.connect(db)
.then(() => console.log('MongoDB connection successful...'))
.catch((err) => console.log(err))

//EJS
app.use(expressLayouts)
app.set("view engine", "ejs");

//BodyParser
app.use(express.urlencoded({extended: false}))

//Express session
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

//Connect flash
app.use(flash())

//Passport middleware
app.use(passport.initialize())
app.use(passport.session()) 

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

//Routes
app.use('/', greet)
app.use('/users',users)

const port = process.env.PROT || 8080;
app.listen(port);
console.log(`Server is listening on port http://localhost:${port}`);
