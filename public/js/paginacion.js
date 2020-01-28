'use strict';

/**  Genero paginación dinámica de acuerdo al número de anuncios.
* Notar que se ha definido de manera estática que el número de anuncios mostrados por página sea 3.
* Esto se podría mejorar fácilmente, pero para la demostración de la práctica se considera suficiente así. 
*/
function paginacion(numPags) {
    let pags = document.getElementById('pags');
    for (let i = 1; i <= numPags; i++) {
        let li = document.createElement('li');
        li.innerHTML = '<a href=/anuncios?limit=3&skip=' + (i-1)*3 + '>' + i + '</a>';
        pags.appendChild(li);
      }
}