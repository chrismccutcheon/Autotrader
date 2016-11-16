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


app.get('/html/main', function(req, res){
  console.log("Main");
	app.user(express.static(__dirname +'/public/html/main.html'));
});

app.use(express.static(__dirname + '/public'));

io.on('connect', function (socket) {
	console.log('User connected via socket.io!');

	socket.on('snapshot', function (symbolsString) {
		var symbols = symbolsString.symbol.split(' ');
		var startDate = symbolsString.startDate;
		var endDate = symbolsString.endDate;
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

  socket.on('', function(symbolsString){

  });
});

app.get('/stocks', middleware.requireAuthentaction, function(req, res){
  var query = req.query;
  var where = {
    userId: req.user.get('id')
  };
  db.stock.findAll({
    where: where
  }).then(function(stocks){
    res.json(stocks)
  }, function(e){
    res.status(500).send();
  });
});

app.post('/stocks', middleware.requireAuthentaction, function(req, res){
  var body = _.pick(req.body, 'symbol', 'quantity', 'initialInvestment');
  db.stock.create(body).then(function(stock){
    req.user.addStock(stock).then(function(){
      return stock.reload();
    }).then(function(stock){
      res.send({result:"success", stock:stock.toJSON()});
    });
  }, function(e){
    res.status(400).json(e);
  })
});

app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password', 'firstname', 'lastname');
	//console.log(body);
	db.user.create(body).then(function (user) {
		res.send({result:"success"});
		console.log('user added');
	}, function () {
		res.status(400).json();
		console.log('rejected');
	});
});

app.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');
	console.log('Login');
  var userIntance;

	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');

    return db.token.create({
      token: token
    });
	}).then(function(tokenInstance){
    test = db.user.findByToken(tokenInstance.dataValues.token)

    test.then(function(user) {
      res.send({result:"success", Auth: tokenInstance.get("token"), User: user.toPublicJSON()});
    }, function(err) {
      alert("Login Failed"); // Error: "It broke"
    });
    console.log("Logged in");
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
//{force: true}
db.sequelize.sync({force: true}).then(function() {
	http.listen(PORT, function(){
  	console.log('listening on :' + PORT);
	});
});
