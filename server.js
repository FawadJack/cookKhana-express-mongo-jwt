const express = require("express");
require("dotenv").config(); //this wil allow to use process.env anywhere in the server
const app = express();
const PORT = 8000;
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("./MVC/model/db");
const { User } = require("./MVC/model/user");
const { Recipe } = require("./MVC/model/recipes");
const {
  signupErr,
  loginErr,
  createToken,
  auth,
  alreadyAuth,
  recipeError,
} = require("./MVC/middleware");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser"); //without cookie-parser req.cookies give undefine

//middleware
app.use(express.json()); //use to make sure json is handle
//use this middleware to get data directly from html form
app.use(express.urlencoded({ extended: true }));
//use this middleware to allow relavent path
app.use(express.static(__dirname + "/public"));
//to make sure we dont get undefine jwt token error and instead redirect to login if not login
app.use(cookieParser());

//we can put this code in dbconnect becasue we only want the server to listen when user is connected to db
app.listen(PORT, (err) => {
  if (err) return err;
  console.log("Server is Running at http://localhost:" + PORT);
});

//connect to database
connectDB();

//ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // this is to define that our ejs files are in this path from root

//Routes
app.get("/", auth, async (req, res) => {
  try {
    // const data = await Recipe.find() //to get all the data from Recipe model (we apply function on model)
    const data = await Recipe.find().sort({ createdAt: -1 }); //sort in decending order
    // res.send(data)
    // const {author,title,detail} = data
    res.render("showallrecipe", { recipes: data });
  } catch (error) {
    res.render("showallrecipe", { error: error });
  }
});

//login
app.get("/login", alreadyAuth, (req, res) => {
  const error = req.query.err;
  const msg = req.query.msg;
  res.render("login", { error: error, msg: msg });
});

//signup
app.get("/signup", alreadyAuth, (req, res) => {
  res.render("signup");
});

// app.get("/register", async (req, res) => {
//   const user = new User({
//     username: "hammad111",
//     email: "hammad11@gmail.com",
//     password: "12345",
//   });
//   try {
//     //now to save that we will use
//     const data = await user.save();

//     console.log(data);
//     res.send(data);
//   } catch (error) {
//     if (error) {
//       res.send(error.errmsg);
//     }
//   }
// });

//post signup
app.post("/signup", signupErr, async (req, res) => {
  //get data from body
  const { username, email, pass } = req.body;
  //   console.log(data);

  try {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(pass, saltRounds);
    //make instance of User object
    const user = new User({
      username: username,
      email: email,
      password: hashPass,
    });

    //now save it
    const result = await user.save();

    res.redirect("/login?msg=Register Successfully!");
  } catch (error) {
    console.log(error);
    res.redirect("/signup?msg=Something went wrong");
  }
});

//login post
app.post("/login", loginErr, async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  const token = createToken(user._id,user.username);
  const maxAge = 2 * 60;
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: maxAge * 1000,
  });

  res.redirect("/");
});

//recipe
app.get("/recipe", auth, async (req, res) => {
  res.render("recipes");
});

//add recipe
app.post("/recipe", auth, recipeError, async (req, res) => {
  const { title, steps } = req.body;

  const recipe = new Recipe({
    userId: req.user.id,
    author: req.user.username.toUpperCase(),
    title: title,
    detail: steps,
  });

  const result = await recipe.save();

  res.redirect("/showallrecipes");
});

//show all recipes
app.get("/showallrecipes", auth, async (req, res) => {
  try {
    // const data = await Recipe.find() //to get all the data from Recipe model (we apply function on model)
    const data = await Recipe.find().sort({ createdAt: -1 }); //sort in decending order
    // res.send(data)
    // const {author,title,detail} = data
    res.render("showallrecipe", { recipes: data });
  } catch (error) {
    res.render("showallrecipe", { error: error });
  }
});

//get user posts
app.get("/myrecipes", auth, async (req, res) => {

  try {

    const recipes = await Recipe.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.render("userPost", {
      recipes: recipes || [],
      error: recipes.length === 0 ? "No Data Available!" : null
    });

  } catch (error) {

    return res.render("userPost", {
      recipes: [],
      error: "Something went wrong"
    });

  }

});
//delete user Post
app.get("/postDelete/:id",auth, async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

//if no page is found use this
app.use((req, res) => {
  res.status(404).render("404");
});
