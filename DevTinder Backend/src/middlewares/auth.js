const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    
    try {
      // Read the token the cookies present inside the request
      const cookies = req.cookies;

      const { token } = cookies;

      if (!token) {
        // throw new Error("Invalid Token!!");
        return res.status(401).send('Please login!!')
      }


      // Validate the token
      const decodedObj = jwt.verify(token, "DEV@Tinder$790");


      // Find the loggedin user
      const { _id } = decodedObj;

      const user = await User.findById(_id);

      if (!user) {
        throw new Error("User not found!!");
      }

      req.user = user

      next()
    } 
    catch (error) {
        res.status(400).send('Error in userAuth middleware : ' + error.message)
    }

}

module.exports = { userAuth }
