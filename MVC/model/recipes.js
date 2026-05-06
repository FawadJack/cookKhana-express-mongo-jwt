const mongoose = require('mongoose');
const { Schema } = mongoose;

//make Schema for user table
const recipeSchema = new Schema({
    author: {
        type: String,
        required: true,
         trim: true
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


},{ timestamps: true })

//make model of scheme
const Recipe = mongoose.model('recipe',recipeSchema)

module.exports = {Recipe}