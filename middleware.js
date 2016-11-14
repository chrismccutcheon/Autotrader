var cryptojs = require('crypto-js');
var _ = require('underscore');
module.exports = function(db){
  return {
    requireAuthentaction: function(req, res, next){
      //var body = _.pick(req.body, 'Auth');
      var token = req.query.Auth || '';
      //console.log(token);
      db.token.findOne({
        where:{
          tokenHash: cryptojs.MD5(token).toString()
        }
      }).then(function(tokenInstance){
        if(!tokenInstance){
          throw new Error();
        }
        
        console.log('Found token');
        req.token = tokenInstance;
        return db.user.findByToken(token);
      }).then(function(user){
        console.log("Authentication passed");
        req.user = user;
        next();
      }).catch(function(){
        console.log("Authentication failed");
        res.status(401).send();
      });
    }
  };
};
