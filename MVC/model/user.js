const mongoose = require('mongoose');
const { Schema } = mongoose;

//make Schema for user table
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 20
    }
  },
  { timestamps: true }
);

//make model for user using schema
// const User = mongoose.model('collection name',schema with which we need to connect this model);  
const User = mongoose.model('User',userSchema);  

//function to save data
const saveUserData = async ()=>{
  const user = new User({
    username: "Fawad",
    email: "fawad@gmail.com",
    password: "12345"
  })

  //now to save that we will use
  const res= await user.save()
  const result = await res.json()

  console.log(result)
}


module.exports = { User,saveUserData }