var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var yahooFinance = require('yahoo-finance');
var _ = require('underscore');
var moment = require('moment');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
//moment().format();

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

app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});



db.sequelize.sync().then(function() {
	http.listen(PORT, function(){
  	console.log('listening on :' + PORT);
	});
});
