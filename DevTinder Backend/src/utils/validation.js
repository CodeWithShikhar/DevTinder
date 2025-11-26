const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  }
  //   else if (validator.isStrongPassword(password)) {
  //     throw new Error("Please enter a strong password!");
  //   }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "about",
    "skills",
    "age"
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };

// if (!firstName || !lastName || !emailId || !password) {
//   res.status(400).send("All fileds are required!!");
// }

// if (firstName.length < 4) {
//   res.status(400).send("First name must be at least 4 characters!!");
// }

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// if (!emailRegex.test(emailId)) {
//   res.status(400).send("Invalid email format!!");
// }

// if (password.length < 6) {
//   res.status(400).send("Password must be at least 6 characters");
// }

// if (age && age < 18) {
//   return res.status(400).send("Age must be 18 or above");
// }
