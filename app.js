const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const helper = require("./helpers/index");

const indexRouter = require('./routes/index');
const authorityRouter = require('./routes/authority');
const cardRouter = require('./routes/card');
const cardTemplateRouter = require('./routes/cardTemplate');
const departmentRouter = require('./routes/department');
const documentRouter = require('./routes/document');
const noteRouter = require('./routes/notes');
const folderRouter = require('./routes/folder');
const groupRouter = require('./routes/group');
const userRouter = require('./routes/user');
const formRouter = require('./routes/form');
const ajaxRouter = require('./routes/ajax');
const loginRouter = require('./routes/login');
const checkAuth = require("./middleware/checkAuth");
const pagelimit = require("./middleware/pagelimit");
const addmenu = require("./middleware/addMenu");

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout', extname: '.hbs', helpers: {
    consoleLog: function(o){
      return console.log(o);
    },
    if_equal: function (a, b, opts) {
      if (a == b) {
        return opts.fn(this)
      } else {
        return opts.inverse(this)
      }
    },
    if_in: function (a, b, opts) {
      if (a && a.indexOf(b)>-1) {
        return opts.fn(this)
      } else {
        return opts.inverse(this)
      }
    },
    jsonStringify: function (value) {
      return JSON.stringify(value);
    },
    cFormName: function (value, formType) {
      let prefix  = formType === "add" ? "duForm_" : "dForm_";
      return prefix+helper.slugify(value);
    },
    getObjectVal: function (obj, key, formType) {
      let rString = formType === "add" ? "" : obj && obj[helper.slugify(key)];
      return rString;
    },
    ifCond: function(v1, operator, v2, options){
      switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
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

app.use(addmenu); // side menu add

app.use('/login', loginRouter);
app.use('/', checkAuth, indexRouter);
app.use('/authorities', checkAuth, authorityRouter);
app.use('/cards', checkAuth, cardRouter);
app.use('/cardtemplates', checkAuth, cardTemplateRouter);
app.use('/departments', checkAuth, departmentRouter);
app.use('/documents', checkAuth, documentRouter);
app.use('/notes', checkAuth, noteRouter);
app.use('/folders', checkAuth, folderRouter);
app.use('/groups', checkAuth, groupRouter);
app.use('/users', checkAuth, userRouter);
app.use('/forms', checkAuth, formRouter);
app.use('/ajax', checkAuth, ajaxRouter);

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
