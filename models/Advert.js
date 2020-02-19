'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertSchema = mongoose.Schema({
    creationDate: Date,
    //userOwner: String,
    userOwner: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {type: String, unique: true, index: true},
    slugName: {type: String, unique: true},
    description: String,
    photo: String, 
    type: Boolean,
    price: { type: Number, index: true },
    tags: { type: [String], index: true},
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
    let userOwnerFilter = {};
    
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
        
        if (prices.length === 2){
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
    if (filter.tag){
        if (typeof filter.tag === 'string') { //si es string, significa que sólo se ha pasado un tag
            tagFilter = { tags: filter.tag };
        } else { // si no, llega un array de tags
            //tagFilter = { tag: {$in: [filter.tag] } };
            /* la query de arriba no funciona como debería. Hace un filtro AND entre la lista de tag y yo quiero uno OR... 
            * en la documentación dice que hace un filtro or...
            * Implemento la query de abajo, que aunque no es elegante, funciona como yo espero.
            */ 
           tagFilter = { $or: [ { tag: filter.tag[0] } , { tag: filter.tag[1] }, { tag: filter.tag[2] }, { tag: filter.tag[3] } ] };
        }
        Object.keys(tagFilter).forEach((key) => filtering[key] = tagFilter[key]);
        
    }

    if (filter.userOwner){
        userOwnerFilter = { userOwner: filter.userOwner };
        Object.keys(userOwnerFilter).forEach((key) => filtering[key] = userOwnerFilter[key]);
    }


    /* Hago la búsqueda combinada con todos los filtros que han pasado por parámetro */
    query = Advert.find(filtering).populate({ path: 'userOwner' }) //revisar lo del populate

                     
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(cb);
};


const Advert = mongoose.model('Advert', advertSchema);

