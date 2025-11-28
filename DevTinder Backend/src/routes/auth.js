const express = require('express')
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const validator = require('validator')
const { validateSignUpData } = require("../utils/validation.js");

const authRouter = express.Router()

// POST /signup - Create new account
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    // Validation of incoming data
    validateSignUpData(req);

    // Encryption of password
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = {
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    };

    const user = new User(userObj);

    const savedUSer = await user.save();

      // Create a JWT Token
      const token = await savedUSer.getJWT()

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      })

    res.json({
      message: "User added successfully!!",
      data: savedUSer
    });
  } 
  catch (error) {
    res.status(400).send("Error in signup api : " + error.message);
  }

});


// POST /login
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not valid!!");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials 🥲🥲");
    }

    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {

      // Create a JWT Token
      const token = await user.getJWT()

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      })

      res.send(user);
    } 
    else {
      throw new Error("Invalid credentials 🥲🥲");
    }
  } 
  catch (error) {
    // res.status(400).send("Error in login api : " + error.message);
    res.status(400).send(error.message);
  }

});


// POST /logout
authRouter.post('/logout', async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now())
        })
        res.send('Logout successfull!! 😀😀')
    } 
    catch (error) {
        res.status(400).send('Error in logout api : ' + error.message)
    }    
})


module.exports = authRouter
