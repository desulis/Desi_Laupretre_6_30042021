const Sauce = require('../models/Sauce');

const fs = require('fs'); //function file system that allow to modify the file system like delete


//export all function that was in route.js
exports.createSauce = (req, res, next) => { 
  const sauceObject = JSON.parse(req.body.sauce); //parse Json to get object utilisable
  delete sauceObject._id;
  const sauce = new Sauce({ //a chain request that converted from Sauce
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //protocol : get a segment from http, add // and a server host, folder image and filename
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'New sauce is saved!'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // file ? exist or not
    {
      ...JSON.parse(req.body.sauce), // if yes, parse the object and create as createSauce
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //if not create one
    Sauce.findOne({
      _id: req.params.id
    }).then( (sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { 
        });
      }
    )
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Your sauce is modified!'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //id as a parameter to find a thing correspondance to request
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; //split image name and take second one after /images/ so [1]
      fs.unlink(`images/${filename}`, () => { //unlink the value that we split from image name
        Sauce.deleteOne({ _id: req.params.id }) //and delete it
          .then(() => res.status(200).json({ message: 'Your sauce is deleted!'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likesSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //id as a parameter to find a thing correspondance to request
  .then(sauce => {
    const like = req.body.like;
    const userId = req.body.userId;
    if (like !== 0 && (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId))) {
      res.status(400).json({ message: 'We got your thumb already!'});
      return
    }
    let message
    if (like === 1) {
      sauce.usersLiked.push(userId);
      message = 'You liked this sauce!';
      sauce.likes += 1
    } else if (like === 0) {
      let index = sauce.usersLiked.indexOf(userId);
      if (index > -1) {
        sauce.usersLiked.splice(index, 1);
        message = 'You unliked this sauce!';
        sauce.likes -= 1
      }
      else {
        index = sauce.usersDisliked.indexOf(userId);
        if (index > -1) {
          sauce.usersDisliked.splice(index, 1);
          message = 'You undisliked this sauce!';
          sauce.dislikes -= 1
        } else {
          res.status(400).json({ message: 'Nothing to unlike or undislike!'});
          return
        }
      }
    } else if (like === -1) {
      sauce.usersDisliked.push(userId);
      message = 'You disliked this sauce!';
      sauce.dislikes += 1
    }
    sauce.save()
    res.status(200).json({ message })
  })
  .catch(error => res.status(400).json({ error }))
};