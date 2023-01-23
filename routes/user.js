const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
const User = require('../model/User')
//Login
router.get("/login", (req, res) => {
  res.render("login");
});  
//Register

router.get('/register',(req, res) => {
    res.render('register')
})

//Register Handler
router.post('/register', (req, res) => {
  const {name, email, password, password1} = req.body;
  let errors= [];

  //Check required fields
  if(!name || !email || !password || !password1){
    errors.push({msg: 'Please fill all the fields'})
  }
  if(password !== password1) {
    errors.push({msg: "Passwords do not match"})
  }

  //Check password length
  if(password.length < 6){
    errors.push({msg: 'Password should be at least 6 characters.'})
  }

  if(errors.length > 0){
    res.render('register', {
      errors,
      name,
      email,
      password,
      password1
    });
  }else {
    //Validation 
    User.findOne({email: email})
    .then(user => {
      if(user){
        //User exist
        errors.push({msg: 'Email already registered.'})
        res.render('register', {
          errors, 
          name, 
          email, 
          password,
          password1
        })
      } else {
        const newUser = new User({
          name, 
          email,
          password
        })

        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            // Set password to hashed
            newUser.password = hash;
            
            //Save user
            newUser.save()
            .then(user => {
              req.flash('success_msg','You are now registered and can login now')
              res.redirect('/users/login')
            })
            .catch(err => console.log(err))
          }))
      }
    })
  }
})

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

//Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  req.redirect('/users/login')
})
module.exports = router;
