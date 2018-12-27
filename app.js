var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var TelegramBot = require('node-telegram-bot-api');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import Request from 'request-promise';
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var debug = require('debug')('untitled:server');
import Config from './config';

const bot = new TelegramBot(Config.botToken,{polling: true});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/**
 * Bot Telegram
 * */
bot.onText(/\/kn/, async (msg) => {
  try{
    let eth = await request({
      method: 'GET',
      uri: 'https://api.bankcex.com/api/v1/ticker/24hr?symbol=ETHUSDT',
      json: true
    });
    let data = await request({
      method: 'GET',
      uri: 'https://api.bankcex.com/api/v1/ticker/24hr?symbol=KNETH',
      json: true
    });
    bot.sendMessage(msg.chat.id,`Price KNOW in Bankcex:\nKN/ETH: ${data.lastPrice}\nPercent Change : ${data.priceChangePercent}%\nKN/USDT: ${data.lastPrice*eth.lastPrice}`);  }catch (err){
    console.log('error: ',err);
    bot.sendMessage(msg.chat.id,'Error connect server bankcex.');
  }
});

bot.onText(/\/eth/, async (msg) => {
  try{
    let marketcap = await request({
      method: 'GET',
      uri: 'https://api.coinmarketcap.com/v1/ticker/ethereum',
      json: true
    });
    let etherscan = await request({
      method: 'GET',
      uri: 'https://api.etherscan.io/api?module=stats&action=ethprice',
      json: true
    });
    bot.sendMessage(msg.chat.id,`In CoinMarketCap :\nRank: ${marketcap.rank}\nUSDT/ETH: ${marketcap.lastPrice}\nBTC/ETH: ${marketcap.price_btc}\nPercent Change 1h : ${marketcap.percent_change_1h}%\n\nIn Etherscan:\nUSDT/ETH: ${etherscan.result.ethusd}\\nBTC/ETH: ${marketcap.result.ethbtc}`);
  }catch (err){
    console.log('error: ',err);
    bot.sendMessage(msg.chat.id,'Error connect server bankcex.');
  }
});


/**
 * Config server
 * */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Function Request
 * */
async function request(options) {
  return new Promise((resolve, reject)=>{
    Request(options).then((response)=>resolve(response)).catch((err)=>reject(err));
  })
}
/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
