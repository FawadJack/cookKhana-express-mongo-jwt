const mongoose = require('mongoose')


//connect db
const connectDB = async () => {
  try {
    // const dbURL =
    //   "mongodb+srv://cookkhana:12345Pakistan@mongodbprac.qlazxqy.mongodb.net/CookKhana?retryWrites=true&w=majority";

    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
    // app.listen(PORT) // only make request to server when db is connected

  } catch (error) {
    console.log("Cannot connect to DB:", error);
  }
};

module.exports = { connectDB }