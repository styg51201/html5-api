var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const serverIndex = require('serve-index')
const cors = require('cors');

const multer = require('multer')


const upload = require(__dirname + '/routes/upload-module');


// var indexRouter = require('./routes/index');
//先不要跟目錄的畫面
var usersRouter = require('./routes/users');

var app = express();

const whitelist = [
  'http://localhost:63342',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3300',
  undefined,
];

const corsOptions = {
  credentials: true,
  // methods: ["POST"],
  origin: true,
  maxAge: 3600,
  origin: function (origin, callback) {
    console.log('origin:', origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true); // true允許拜訪
    } else {
      callback(null, false); // 不允許
    }
  }
};

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/users', usersRouter);



//把session 作為一個獨立檔, 這樣在不同地方require進來就是同一個 EX:websocket 要用
app.use(require('./routes/session-parser-module'));


app.post('/upload-single', upload.single('avatar'), (req, res) => {
  res.json(req.file);
});



app.get('/try-sess', (req, res) => {
  req.session.shin = req.session.shin || 0;
  req.session.shin++;

  res.json(req.session);
  //res.end(req.session.shin.toString());
});

app.get('/try-sse', (req, res) => {
  let id = 30;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  //setInterval的做法不好,會佔資源,即使用戶端斷線,程式也還會運作
  setInterval(function () {
    let now = new Date();
    //只能用write
    res.write('id: ' + id++ + '\n');
    res.write('data: ' + now.toLocaleString() + '\n\n');
  }, 2000);
});

const loginList = {
  'aaa': {
    pw: '123456',
    name: '小明'
  },
  'bbb': {
    pw: '456789',
    name: '小王'
  },
}


app.post('/homework/login', upload.none(), (req, res) => {
  if (req.body.user && req.body.password) {
    if (loginList[req.body.user] && req.body.password === loginList[req.body.user].pw) {

      req.session.loginUser = req.body.user;
      req.session.loginData = loginList[req.body.user];
      console.log(req.session)

      res.json({
        success: true,
        msg: '登入成功',
        body: req.body,
        name: loginList[req.body.user].name
      });
    }
  }
  console.log('222')
  res.json({
    success: false,
    msg: '登入失敗',
    body: req.body
  })

})



app.use('/', serverIndex('public', { 'icons': true }))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
