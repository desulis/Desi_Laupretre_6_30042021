const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); //import the midleware of authentification
const multer = require('../middleware/multer-config');
//import the controllers.stuff that now has all function router
const stuffCtrl = require('../controllers/sauce'); 

router.get('/', auth, stuffCtrl.getAllStuff); //request must passed the authentification middleware before controllers
router.post('/', auth, multer, stuffCtrl.createSauce);
router.post('/:id/like', auth, stuffCtrl.likesSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);

module.exports = router;

//now in this file is more cleaner because all the logic of the function imigrate to controllers folder