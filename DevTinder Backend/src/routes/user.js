const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();


// Get all the pending connection request of the loggedInUser
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingConnectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
      "photoUrl",
    ]);

    res.json({
      message: "All the pending requests fetched successfully!!",
      pendingConnectionRequest: pendingConnectionRequest,
    });
  } catch (error) {
    res
      .status(400)
      .send(
        "Error in getting pending connection requests api : " + error.message
      );
  }
});


// Get info about who have accepted my connection request or info about those whose requests are accepted by me
userRouter.get("/user/connections", userAuth, async (req, res) => {

  try {
    const loggedInUser = req.user;

    const myAllConnectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"])
      .populate("toUserId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]);

    const data = myAllConnectionRequests.map((row) => {
        if (row.fromUserId.toString() === loggedInUser._id.toString()) {
            return row.toUserId
        }
        return row.fromUserId
    });

    res.json({
      message: "My all connections are here...",
      myAllConnections: data,
    });

  } 
  catch (error) {
    res
      .status(400)
      .send("Error in getting all the connections : " + error.message);
  }
  
});


// Get Feed API
userRouter.get('/feed', userAuth, async (req, res) => {
  
  try {
    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit 

    const skip = (page - 1) * limit

    const loggedInUser = req.user

    const myAllConnectionRequests = await ConnectionRequest.find({
      $or: [
        {fromUserId: loggedInUser._id},
        {toUserId: loggedInUser._id}
      ]
    })
    .select("fromUserId toUserId")
    .populate('fromUserId', ['firstName'])
    .populate('toUserId', ['firstName'])

    const hideUsersFromFeed = new Set()

    // myAllConnectionRequests.forEach(r => {
    //   hideUsersFromFeed.add(r.fromUserId.toString())
    //   hideUsersFromFeed.add(r.toUserId.toString())      
    // });

    myAllConnectionRequests.forEach(r => {
      hideUsersFromFeed.add(r?.fromUserId?._id);
      hideUsersFromFeed.add(r?.toUserId?._id);
    });

    const users = await User.find({
      $and: [
       { _id: { $nin: Array.from(hideUsersFromFeed) }},
       { _id: { $ne: loggedInUser._id } }
      ]
    }).select("firstName lastName age gender about skills photoUrl").skip(skip).limit(limit)

    res.send(users)

  } 
  catch (error) {
    res.status(400).send('Error in getting feed api : ' + error.message)
  }

})


module.exports = userRouter;
