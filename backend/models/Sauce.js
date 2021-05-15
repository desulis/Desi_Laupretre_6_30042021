const mongoose = require('mongoose'); //import mongoose

const sauceSchema = mongoose.Schema({ //use object Schema to create a schema of database
  name: { type: String, required: true }, //constructor type String and it's required, if it's empty then error
  imageUrl: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  heat: { type: Number, required: true },
  userId: { type: String, required: true },
  likes: {type : Number},
	dislikes: {type : Number},
	usersLiked: [{type : String}], //array of string mongoo
	usersDisliked: [{type : String}]
});

module.exports = mongoose.model('Sauce', sauceSchema); //export the module thingSchema in 'thing' as a model to create database