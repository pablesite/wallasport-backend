'use strict';

/* Coge la cadena de búsqueda del textlabel textBuscar y genera una query */
function buscar(){
    let textBuscar = document.getElementById('textBuscar').value;
    window.location = '/anuncios?nombre=' + textBuscar;
}
    
