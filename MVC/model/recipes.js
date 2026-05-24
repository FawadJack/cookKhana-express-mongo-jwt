const mongoose = require('mongoose');
const { Schema } = mongoose;

//make Schema for user table
const recipeSchema = new Schema({

    author: {
        //this is done to make sure the author take user id so we can use it for searching specific user posts
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    detail: {
        type: String,
        trim: true
    }

}, { timestamps: true });
//make model of scheme
const Recipe = mongoose.model('recipe',recipeSchema)

module.exports = {Recipe}