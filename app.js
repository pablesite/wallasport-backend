const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const app = express();
require('./lib/connectMongoose');
require('./models/Advert');


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


// middlewares para permitir CORS desde el frontal.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.URL_CORS); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  next();
});

app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.URL_CORS);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.sendStatus(200);
});


app.use('/', require('./routes/index'));


// Configuración de Multer, para subir ficheros.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    req.body.photo = file.originalname;
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });
const jwtAuth = require('./lib/jwtAuth');
const advertsController = require('./routes/apiv1/adverts');

/* ------------------------------------------------------------------ */
/** Rutas de mi API */

// public routes

app.use('/apiv1/login', require('./routes/apiv1/loginAPIController'));
app.use('/apiv1/register', upload.single('photo'), require('./routes/apiv1/registerNewUser'));
app.get('/apiv1/adverts', advertsController.get);
app.get('/apiv1/adverts/:slugName', advertsController.goToAdvertDetail);
app.use('/apiv1/tags', require('./routes/apiv1/tags'));

// private rotues
app.use('/apiv1/user', jwtAuth(), upload.single('photo'), require('./routes/apiv1/userController'));
app.post('/apiv1/adverts', jwtAuth(), upload.single('photo'), advertsController.post);
app.put('/apiv1/adverts/:slugName', jwtAuth(), upload.single('photo'), advertsController.put);
app.delete('/apiv1/adverts/:slugName', advertsController.delete);



/** catch 404 and forward to error handler */
app.use(function (req, res, next) {
  next(createError(404));
});


/** error handler */
app.use(function (err, req, res, next) {
  /** comprobar error de validación */
  if (err.array) {
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }


  /** set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  /** render the error page */
  res.status(err.status || 500);
  if (isAPI(req)) {
    res.json({ ok: false, err: err.message });
    return;
  }
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/api') === 0;
}

module.exports = app;
