const { User } = require("./model/user");

// function to handle signup form validation
const signupErr = async (req, res, next) => {

  const { username, email, pass, confirm_pass } = req.body;

  const signuperrors = [];

  // Username validation
  if (!username || !username.trim()) {
    signuperrors.push("Enter Username!");
  }

  if (username && username.length < 5) {
    signuperrors.push("Username must be more than 5 characters!");
  }

  // Email validation
  if (!email || !email.trim()) {
    signuperrors.push("Enter Email!");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check existing email
  if(email && emailRegex.test(email)){
    const existingUser = await User.findOne({ email: email });
 
    if(existingUser){
       signuperrors.push("Email Already Exists!");
    }
 }

  // Password validation
  if (!pass) {
    signuperrors.push("Enter Password!");
  }

  if (pass < 5) {
    signuperrors.push("Password must be more than 5 characters!");
  }

  if (pass && pass !== confirm_pass) {
    signuperrors.push("Both Passwords must Match!");
  }

  // Render errors
  if (signuperrors.length > 0) {
    return res.render("signup", {
      signupErrs: signuperrors,
    });
  }

  next();
};

module.exports = { signupErr };