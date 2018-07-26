const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const expressValidator = require('express-validator');
const expressSession = require('express-session');

const indexRouter = require('./routes/index');
const authorityRouter = require('./routes/authority');
const cardRouter = require('./routes/card');
const departmentRouter = require('./routes/department');
const documentRouter = require('./routes/document');
const folderRouter = require('./routes/folder');
const roleRouter = require('./routes/role');
const userRouter = require('./routes/user');
const loginRouter = require('./routes/login');
const checkAuth = require("./middleware/checkAuth");
const pagelimit = require("./middleware/pagelimit");

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout', extname: '.hbs', helpers: {
    if_equal: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this)
      } else {
        return opts.inverse(this)
      }
    }
  }
}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'dumer',
  resave: false,
  saveUninitialized: false
}));

app.use(pagelimit); // for table

app.use('/login', loginRouter);
app.use('/', checkAuth, indexRouter);
app.use('/authorities', checkAuth, authorityRouter);
app.use('/cards', checkAuth, cardRouter);
app.use('/departments', checkAuth, departmentRouter);
app.use('/documents', checkAuth, documentRouter);
app.use('/folders', checkAuth, folderRouter);
app.use('/roles', checkAuth, roleRouter);
app.use('/users', checkAuth, userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
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
