const
  path = require('path'),
  config = require('config'),
  logger = require('morgan'),
  express = require('express'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  fileUpload = require('express-fileupload');
  
// Session Storage
let
  session = require('express-session'),
  MySQLStore = require('connect-mysql')(session);

// HTTP routes  to be imported here
let api = require('./routes/http/api');

let app = express();

// Middleware use
app.use(fileUpload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'})); 
app.use(express.static(path.join(__dirname, 'dist')));

app.use(cookieParser());
app.use(session({
  key: 'connect.id',
  secret: config.get('sessionSecret'),
  store: new MySQLStore({config: config.get('dbConfig')}),
  resave: false,
  saveUninitialized: false
}));

// Point static path to dist
app.use('/', express.static(path.join(__dirname, 'static')));
app.use('/file',express.static(path.join(__dirname, 'uploads')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

// Render engine setup 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;