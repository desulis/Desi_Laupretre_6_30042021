const multer = require('multer'); //a package that allow to manage files that enter the HTTP request

const MIME_TYPES = { //type of image registered
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //multer as configuration storage
  destination: (req, file, callback) => { //indicate to multer where the files should save
    callback(null, 'images'); //here in folder image
  },
  filename: (req, file, callback) => { //indicate to multer the filename
    const name = file.originalname.split(' ').join('_'); //use a original name and replace a space with _
    const extension = MIME_TYPES[file.mimetype]; //use the var mime_types
    callback(null, name + Date.now() + '.' + extension); //final filename
  }
});

module.exports = multer({storage: storage}).single('image'); //export configurated multer and indicate that we generate only image 