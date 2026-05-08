const express = require("express");
require("dotenv").config(); //this wil allow to use process.env anywhere in the server
const app = express();
const PORT = 8000;
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("./MVC/model/db");
const { User } = require("./MVC/model/user");
const { Recipe } = require("./MVC/model/recipes");
const { signupErr } = require("./MVC/middleware")

//middleware
app.use(express.json());
//use this middleware to get data directly from html form
app.use(express.urlencoded());
app.use(express.static(__dirname + "/public"));

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
app.get("/", (req, res) => {
  res.render("index", { title: "CookKhana" });
});

//login
app.get("/login", (req, res) => {
    const error = req.query.err
    const msg = req.query.msg
  res.render("login",{error: error , msg: msg});
});

//signup
app.get("/signup", (req, res) => {
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
app.post("/users",signupErr, async (req, res) => {
  //get data from body
  const { username, email, pass } = req.body;
//   console.log(data);
  try {
    //make instance of User object
    const user = new User({
      username: username,
      email: email,
      password: pass,
    });

    //now save it
    const result = await user.save();
    
    res.redirect('/login?msg=Register Successfully!');
  } catch (error) {
    console.log(error);
    res.redirect('/signup?err=Something went wrong');
  }
});

//recipe
app.get("/recipe", async (req, res) => {
  //make new instance of Recipe document
  const recipe = new Recipe({
    author: "Haris",
    title: "Second Recipe",
    detail: "Steps:hsdkashdkjashduiwhdi",
  });

  try {
    //save
    const data = await recipe.save();
    res.send(data);
  } catch (error) {
    res.send(error.errmsg);
  }
});
//show all recipes
app.get("/showallrecipes", async (req, res) => {
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

//if no page is found use this
app.use((req, res) => {
  res.status(404).render("404");
});
