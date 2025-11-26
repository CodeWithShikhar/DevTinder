const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

// POST - This api is for sending a request to an user - Interested or Ignored
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const toUserId = req.params.toUserId;

      const status = req.params.status;

      // Check 1
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type : " + status });
      }

      // Check 2
      const toUserExists = await User.findById(toUserId);
      if (!toUserExists) {
        return res.status(404).json({
          message: "Error in sending conection request api : User not found!!",
        });
      }

      // Check 3: if there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection request already exists!!");
      }

      // Check 4, go see ConnectionRequest Schema

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      const toUserDetails = await User.findById(toUserId);

      res.json({
        message:
          req.user.firstName +
          " is " +
          status +
          " in " +
          toUserExists.firstName,
        connectionRequestData: data,
      });
    } catch (error) {
      res
        .status(400)
        .send("Error in sending connection request api : " + error.message);
    }
  }
);


// POST - This api is for reviewing the incoming request - Accept or Reject
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {

    try {
      const loggedInUser = req.user;

      const status = req.params.status;

      const requestId = req.params.requestId;

      // Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status not allowed!!");
      }

      // Check whether the incoming request exists in DB, the user to whom request was sent is loggedIn or not, the person who sent the request was intereted or not
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not found!!");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        connectionRequest: data,
      });
    } 
    catch (error) {
      res.status(400).send("Error in reviewing request api : " + error.message);
    }

  }
);

module.exports = requestRouter;
