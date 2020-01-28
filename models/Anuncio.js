'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    nombre: {type: String, unique: true},
    venta: Boolean,
    precio: Number,
    foto: String, 
    tag: [String]
});


anuncioSchema.statics.list = function(filter, limit, skip, fields, sort, cb) {
    /* Compruebo qué viene en el filtro */

    let query;
    let filtradoNombre = {};
    let filtradoVenta = {};
    let filtradoPrecios = {};
    let filtradoTag = {};

    let filtrado={};

    /* Si es un nombre, se filtra con una expresión regular que permite buscar por los primeros caracteres del nombre */
    if (filter.nombre){
        filtradoNombre = { nombre: new RegExp('^'+ filter.nombre, 'i') };
        Object.keys(filtradoNombre).forEach((key) => filtrado[key] = filtradoNombre[key]);
    }

    /* Si es un tipo de anuncio, se filtra simplemente tal cual */
    if (filter.venta){
        filtradoVenta = {venta: filter.venta};
        Object.keys(filtradoVenta).forEach((key) => filtrado[key] = filtradoVenta[key]);
    }
    
    /* Si es un precio, hay que usar combinaciones */
    if (filter.precio){
        let precios = filter.precio.split('-');
        
        if (precios.length === 2){
            if (precios[0] ===''){
                filtradoPrecios = { precio:  { '$lte': precios[1] }};
            } else if (precios[1] === ''){
                filtradoPrecios = { precio:  { '$gte': precios[0] } };
            } else {
                filtradoPrecios = { precio:  { '$gte': precios[0], '$lte': precios[1] } };
            }

        } else if (precios.length === 1){
            filtradoPrecios = { precio: parseFloat(precios) };
        }
        Object.keys(filtradoPrecios).forEach((key) => filtrado[key] = filtradoPrecios[key]);
    }

    /* Si es un tag, hay que usar condiciones */
    if (filter.tag){
        if (typeof filter.tag === 'string') { //si es string, significa que sólo se ha pasado un tag
            filtradoTag = { tag: filter.tag };
        } else { // si no, llega un array de tags
            //filtradoTag = { tag: {$in: [filter.tag] } };
            /* la query de arriba no funciona como debería. Hace un filtro AND entre la lista de tag y yo quiero uno OR... 
            * en la documentación dice que hace un filtro or...
            * Implemento la query de abajo, que aunque no es elegante, funciona como yo espero.
            */ 
            filtradoTag = { $or: [ { tag: filter.tag[0] } , { tag: filter.tag[1] }, { tag: filter.tag[2] }, { tag: filter.tag[3] } ] };
        }
        Object.keys(filtradoTag).forEach((key) => filtrado[key] = filtradoTag[key]);
        
    }

    /* Hago la búsqueda combinada con todos los filtros que han pasado por parámetro */
    query = Anuncio.find(filtrado);
                                
    query.limit(limit);
    query.skip(skip);
    query.select(fields);
    query.sort(sort);
    query.exec(cb);
};


const Anuncio = mongoose.model('Anuncio', anuncioSchema);

// Creación de índices en los campos en los que haremos búsquedas. 
// Esto mejora en mucho la velocidad de consulta de la db
// anuncioSchema.index({nombre: 1, venta: 1, precio: 1, tag: 1 });

