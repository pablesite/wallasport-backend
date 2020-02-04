'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');


/* Recupero lista de tags */
router.get('/', function(req, res, next){
    
    Anuncio.find().exec(function(err, list){
        if (err) {
            next(err);
            return;
        }

        /* Obtengo las tags de cada anuncio y las pongo en el array tags */
        let tags = [];
        list.forEach(function(element, index){
            list[index].tags.forEach(function(el, ind){
                tags.push(list[index].tags[ind]);
            });          
        });

        /* Función que devuelve elementos únicos en un array */
        Array.prototype.unique=function(a){
            return function(){
                return this.filter(a);
            };
        }(function(a,b,c){
                return c.indexOf(a,b+1)<0;
        });
          
        res.json({ok: true, tags: tags.unique()});
        
    });
});


module.exports = router;