var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var yahooFinance = require('yahoo-finance');
var _ = require('underscore');
var moment = require('moment');
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var path = require('path')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


var PORT = process.env.PORT || 3000;
//moment().format();

//app.use(express.bodyParser());

//app.use(login.requireAuthentaction);



app.get('/html/main.html', middleware.requireAuthentaction, function(req, res){
	console.log("main");
	res.sendFile(__dirname +'/public/html/main.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connect', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('snapshot', function (symbolsString) {
    console.log(symbolsString);
		var symbols = symbolsString.symbol.split(' ');
		var startDate = symbolsString.startDate;
		var endDate = symbolsString.endDate;
		console.log(startDate);
    console.log(typeof(startDate));
    yahooFinance.historical({
      symbols: symbols,
			from:startDate,
			to: endDate,
      //fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
    }, function (err, data) {
			var dataSeries = []
			for(var i = 0; i < data[symbols[0]].length; i++){
				//2016-01-29T08:00:00.000Z
				var curdate = moment(data[symbols[0]][i].date).unix();
				//curdate = curdate.unix();
				dataSeries.push([ Number(curdate+"000"), data[symbols[0]][i].close]);
			}
			//console.log(dataSeries);
      io.emit('data', {"title": symbols[0], "data": dataSeries});
    });

	});

});

app.get('/stocks', middleware.requireAuthentaction, function(req, res){
  var query = req.query;
  var where = {
    userId: req.userId.get('id')
  };
  db.stock.findAll({
    where: where
  }).then(function(stocks){
    res.json(stocks)
  }, function(e){
    res.status(500).send();
  });
});

app.post('/addstock', middleware.requireAuthentaction, function(req, res){
  var body = _pick(req.body, 'symbol');
  db.stock.create(body).then(function(stock){
    req.user.addStock(stock).then(function(){
      return stock.reload();
    }).then(function(stock){
      res.json.stock.toJSON();
    });
  }, function(e){
    res.status(400).json(e);
  })
});

app.post('/users', function(req, res){
	console.log(req.body);
	var body = _.pick(req.body, 'email', 'password');
	console.log(body);
	console.log('users');
	db.user.create(body).then(function (user) {
		res.sendFile(path.resolve(__dirname +'/public/index.html'));
		//res.json(user.toPublicJSON());
		console.log('user added');
	}, function (e) {
		res.status(400).json(e);
		console.log('rejected');
	});
});

app.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');
	console.log('Login');
  var userIntance;

	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		console.log(token);

    return db.token.create({
      token: token
    });
	}).then(function(tokenInstance){
    res.header('Auth', tokenInstance.get('token')).sendFile(path.resolve(__dirname +'/public/html/main.html'));

    console.log(tokenInstance.get('token'));
  }).catch( function(){
		res.status(401).send("Invalid Login");
	});
});

app.delete('/users/login', middleware.requireAuthentaction, function(req, res){
  req.token.destroy().then(function(){
    res.status(204).send();
  }).catch(function(){
    res.status(500).send();
  });
});

db.sequelize.sync({force: true}).then(function() {
	http.listen(PORT, function(){
  	console.log('listening on :' + PORT);
	});
});
