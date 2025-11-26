const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://officialshikharmishra2002_db_user:DvqB4NIzW9556riB@cluster0.xlw7hyi.mongodb.net/"
  );
};

connectDB()
  .then(() => {
    console.log("Database connection established...");
  })
  .catch((error) => {
    console.log("Database connot be connected...");
  });

module.exports = connectDB
