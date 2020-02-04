const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const multer  = require('multer');
const app = express();
const mongooseConnection = require('./lib/connectMongoose');
require('./models/Anuncio');


/* ------------------------------------------------------------------ */
/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

//Middlewares
app.use(logger('dev'));

// for parsing application/json
app.use(express.json());

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* ------------------------------------------------------------------ */
/**
 * Inicializamos y cargamos la sesión del usuario que hace la petición
 */
app.use(session({
  name: 'nodeapi-session',
  secret: 'l]~G4zXFW%0uZ^dJ30+?A/b1?=bH)8 82kR(J}3O"8E8>;9@&nuS^Me=g>]Vk`em', //mirar en el curso si esto va en el .env 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, //solo mandar por HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 2 // caducar a los X días de inactividad
  },
  store: new MongoStore({
    // le pasamos cómo conectarse a la bbdd.
    mongooseConnection: mongooseConnection,
  })

}));

// middleware para tener acceso a la sesión en las vistas
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// middlewares para permitir CORS desde el frontal.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.URL_CORS); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  next();
});

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', process.env.URL_CORS);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});




const la = require('@toptensoftware/losangeles');

app.use(la.serve({
  contentPath: path.join(__dirname, 'public')
}).middleware);

app.use('/',                require('./routes/index'));


/* ------------------------------------------------------------------ */
/** Rutas de mi API */



const jwtAuth = require('./lib/jwtAuth');
//const loginControllerAPI = require('./routes/apiv1/loginController');

// Configuración de Multer, para subir ficheros.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    req.body.foto = file.originalname;
    cb(null, file.originalname)

  }
})

const upload = multer({ storage: storage });

app.use('/apiv1/login',  require('./routes/apiv1/loginAPIController'));


const anunciosController = require('./routes/apiv1/anuncios');
//app.use('/apiv1/anuncios', upload.single('foto'), jwtAuth(), require('./routes/apiv1/anuncios')); Separar en diferentes métodos para poder securizar con middleware...
//app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios')); //es el bueno de las pruebas

app.get('/apiv1/anuncios', anunciosController.get);
app.get('/apiv1/anuncios/:id',  anunciosController.getOneAdvert);
app.post('/apiv1/anuncios', anunciosController.post);
app.put('/apiv1/anuncios/:id', anunciosController.put);
app.delete('/apiv1/anuncios/:id', anunciosController.delete);


app.use('/apiv1/tags', require('./routes/apiv1/tags'));



/** catch 404 and forward to error handler */
app.use(function(req, res, next) {
  next(createError(404));
});


/** error handler */
app.use(function(err, req, res, next) {
  /** comprobar error de validación */
  if (err.array) {
    err.status = 422;
    const errInfo = err.array({onlyFirstError: true})[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`; 
  }


  /** set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  /** render the error page */
  res.status(err.status || 500);
  if (isAPI(req)){
    res.json({ok: false, err: err.message});
    return;
  }
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
