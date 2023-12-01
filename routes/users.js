var express = require('express');
var router = express.Router();
//get jwt module
let jwt = require("jsonwebtoken")
const { checkJWTToken, changePasswordVerification, checkUsername, onlyJSON } = require('./middleware')
//get create from controller file
const { create } = require('../controllers/user.controller')
const User = require('../models/userModel')



//post method to add a new user to the database
router.post("/register",checkUsername,  async (req, res) => {
  try {
    // Check if user exists in the database
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }).exec();
    if (user) {
      res.status(401).json({
        message: "user already exists"
      });
    } else {
      // Call the create method from the controller
      await create(req, res); // Pass the request and response objects to the create method
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error occurred while trying to add user" });
  }
});

//login route is a post request
router.post("/login", async (req, res) => {
  //get username and password from request body
  const { username, password } = req.body;
  //find a user with the given username
  const user = await User.findOne({ username: username }).exec()
  //if no user matches or the password property of the user does not equal the password from the request
  if(!user || user.password !== password) {
    //send 401 status
    res.status(401).send({ message: "username or password do not match"})
  } else {
   //if password matches generate jwt token using hs256 algorithm
    let jwtToken = jwt.sign(
      {
        username: username,
        password: password,
      },
      "secretKey",
      { algorithm: 'HS256'}
      
    )//send jwttoken back to client
    res.send(jwtToken);
  }
})






module.exports = router;
