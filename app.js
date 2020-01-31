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
 * Setup i18n
 */
const i18n = require('./lib/i18nConfigure')(); 
app.use(i18n.init);

app.locals.title = 'Wsbackend';

if (app.locals.JWT === undefined){
  app.locals.JWT = '';
}


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

// middleware para aceptar peticiones de otra aplicación (distinto servidor normalmente, o sino, distinto puerto)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.URL_CORS); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/* ------------------------------------------------------------------ */
/** Rutas de mi aplicación web */
const sessionAuth = require('./lib/sessionAuth');
const loginController = require('./routes/loginController');

app.use('/',                require('./routes/index'));
app.use('/change-locale',   require('./routes/change-locale'));
app.use('/anuncios',  sessionAuth('admin'),  require('./routes/anuncios'));

// Usamos el estilo de Controladores para estructurar las rutas siguientes:
app.get('/login',           loginController.index);
app.post('/login',          loginController.post);
app.get('/logout',          loginController.logout);



/* ------------------------------------------------------------------ */
/** Rutas de mi API */

const jwtAuth = require('./lib/jwtAuth');
const loginControllerAPI = require('./routes/apiv1/loginController');

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

app.get('/apiv1/enterJWT', function(req, res, next){
  app.locals.JWT = req.query.token;
  res.redirect('/');
});
app.use('/apiv1/anuncios', upload.single('foto'), jwtAuth(), require('./routes/apiv1/anuncios'));
app.use('/apiv1/tags', jwtAuth(), require('./routes/apiv1/tags'));
app.get('/apiv1/login', loginControllerAPI.index);
app.post('/apiv1/login', loginControllerAPI.loginJWT);


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
