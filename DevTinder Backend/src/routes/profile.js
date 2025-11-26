const express = require("express");
const bcrypt = require('bcrypt')
const validator = require('validator')
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");
const User = require("../models/user.js");

const profileRouter = express.Router();

// GET /profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {

  try {
    const user = req.user;
    res.send(user);
  } 
  catch (error) {
    res.status(400).send("Error in GET profile api : " + error.message);
  }

});


// PATCH /profile/edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save()

    res.json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName}, your profile is updated successfully!! 😀😀`,
        data: loggedInUser
    });
  } 
  catch (error) {
    res.status(400).send("Error in profile edit api : " + error.message);
  }

});


// PATCH /profile/password
profileRouter.patch('/profile/password', userAuth, async (req, res) => {

    try {
       const { currentPassword, newPassword } = req.body
       
       if (!currentPassword || !newPassword) {
        throw new Error("Both current password and new password are required!!");
       }

       const loggedInUser = req.user

       const isCurrentPasswordValid = await bcrypt.compare(currentPassword, loggedInUser.password)

       if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect!!");
       }

       const isNewPasswordSame = await bcrypt.compare(newPassword, loggedInUser.password)

       if (isNewPasswordSame) {
        throw new Error("New password must be different than current password!!");
       }

    //    if (!validator.isStrongPassword(String(newPassword))) {
    //     throw new Error("New password is not strong enough!!");
    //    }

       const newPasswordHash = await bcrypt.hash(newPassword, 10)

       await User.findByIdAndUpdate(loggedInUser._id, 
        {password: newPasswordHash}, 
        {new: true, runValidators: false})

        res.json({
            message: 'Password updated successfully!!😀😀',
            newPassword: newPassword
        })

    } 
    catch (error) {
        res.status(400).send('Error in password edit api : ' + error.message)
    }

})


module.exports = profileRouter;
