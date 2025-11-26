const cors = require('cors')
const express = require("express");
const cookieParser = require('cookie-parser');
const User = require("./models/user.js");
const connectDB = require("./config/database.js");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))


const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js');
const userRouter = require("./routes/user.js");

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)


// GET /feed - Get all feed
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (error) {
//     console.log("Error in getting all feeds");
//   }
// });


// DELETE /user - Delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);

    res.send("User deleted successfully 😀😀");
  } catch (error) {
    console.log("Error in deleting a user by Id");
  }
});


// PATCH /user - Update a user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    if (!Object.keys(data).length) {
      res.status(400).send("No data provided for updates!!");
    }

    if (data.firstName && typeof data.firstName !== "string") {
      res.status(400).send("First Name should be string!!");
    }

    if (data.lastName && typeof data.lastName !== "string") {
      res.status(400).send("Last Name should be string!!");
    }

    if (data.about && typeof data.about !== "string") {
      throw new Error("about must be a string");
    }

    if (data.age !== undefined) {
      if (typeof data.age !== "number") {
        throw new Error("age must be a number");
      }
      if (data.age < 18) {
        throw new Error("Age must be 18 or above");
      }
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "photoUrl",
      "userId",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!");
    }

    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully 😀😀");
  } catch (error) {
    res.status(400).send("Update failed: " + error.message);
  }
  
});


(async () => {
  await connectDB();
})();


app.listen(7777, () => {
  console.log("Server is listening on port 7777...");
});
