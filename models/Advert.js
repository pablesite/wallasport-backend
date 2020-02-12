'use strict';

const mongoose = require('mongoose');

const advertSchema = mongoose.Schema({
    creationDate: Date,
    userOwner: String,
    name: {type: String, unique: true},
    slugName: {type: String, unique: true},
    description: String,
    photo: String, 
    type: Boolean,
    price: Number,
    tags: [String],
    reserved: Boolean,
    sold: Boolean,
    //chat: Object,

});







advertSchema.statics.list = function(filter, limit, skip, fields, sort, cb) {
    /* Compruebo qué viene en el filtro */

    let query;
    let nameFilter = {};
    // let filtradoVenta = {};
    let priceFilter = {};
    let tagFilter = {};

    let filtering={};

    /* Si es un nombre, se filtra con una expresión regular que permite buscar por los primeros caracteres del nombre */
    if (filter.name){
        nameFilter = { name: new RegExp('^'+ filter.name, 'i') };
        Object.keys(nameFilter).forEach((key) => filtering[key] = nameFilter[key]);
    }

    // /* Si es un tipo de anuncio, se filtra simplemente tal cual */
    // if (filter.venta){
    //     filtradoVenta = {venta: filter.venta};
    //     Object.keys(filtradoVenta).forEach((key) => filtrado[key] = filtradoVenta[key]);
    // }
    
    /* Si es un precio, hay que usar combinaciones */
    if (filter.price){
        let prices = filter.price.split('-');
        
        if (precios.length === 2){
            if (prices[0] ===''){
                priceFilter = { price:  { '$lte': prices[1] }};
            } else if (prices[1] === ''){
                priceFilter = { price:  { '$gte': prices[0] } };
            } else {
                priceFilter = { price:  { '$gte': prices[0], '$lte': prices[1] } };
            }

        } else if (prices.length === 1){
            priceFilter = { price: parseFloat(prices) };
        }
        Object.keys(priceFilter).forEach((key) => filtering[key] = priceFilter[key]);
    }
    
    /* Si es un tag, hay que usar condiciones */
    if (filter.tags){
        
        if (typeof filter.tags === 'string') { //si es string, significa que sólo se ha pasado un tag
            tagFilter = { tag: filter.tags };
        } else { // si no, llega un array de tags
            //tagFilter = { tag: {$in: [filter.tag] } };
            /* la query de arriba no funciona como debería. Hace un filtro AND entre la lista de tag y yo quiero uno OR... 
            * en la documentación dice que hace un filtro or...
            * Implemento la query de abajo, que aunque no es elegante, funciona como yo espero.
            */ 
           tagFilter = { $or: [ { tag: filter.tags[0] } , { tag: filter.tags[1] }, { tag: filter.tags[2] }, { tag: filter.tags[3] } ] };
        }
        Object.keys(tagFilter).forEach((key) => filtering[key] = tagFilter[key]);
        
    }

    /* Hago la búsqueda combinada con todos los filtros que han pasado por parámetro */
    query = Advert.find(filtrado);
                                
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(cb);
};


const Advert = mongoose.model('Advert', advertSchema);

// Creación de índices en los campos en los que haremos búsquedas. 
// Esto mejora en mucho la velocidad de consulta de la db
// anuncioSchema.index({nombre: 1, venta: 1, precio: 1, tag: 1 });

