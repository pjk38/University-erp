const bcrypt = require("bcryptjs");

const plainTextPassword = "password123";
const adminpass="ad2122";
const saltRounds = 10;

bcrypt.hash(plainTextPassword, saltRounds, (err, hashed) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hashed);
  }
});
bcrypt.hash(adminpass, saltRounds, (err, hashed) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hashed);
  }
});
