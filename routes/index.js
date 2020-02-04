const express = require('express');
const router = express.Router();


/* Recupero la página principal */
router.get('/', function(req, res, next) {
    console.log('entro')
  res.render('index');
});





module.exports = router;
