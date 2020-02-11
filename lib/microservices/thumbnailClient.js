'use Strict';

const cote = require('cote');

const requester = new cote.Requester({ name: 'thumbnail' });

class ThumbnailClient {

  cliente(url_foto) {
    console.log('url de la foto ', url_foto)
    
    requester.send({
      type: 'foto',
      url_foto: url_foto,
    }, response => {
      console.log(`Cliente: Ya se ha creado el Thumbnail: ${response}`, Date.now());
    });
  }

}

module.exports = new ThumbnailClient();