var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var User = sequelize.define('user', {
  description:{
    type: Sequelize.STRING
  },
  completed:{
    type: Sequelize.BOOLEAN
  }
});

sequelize.sync().then(function(){
  console.log('Everything is synced');
});
