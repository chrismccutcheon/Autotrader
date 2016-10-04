module.exports =  {
  requireAuthentaction: function(req, res, next){
    console.log("Test");
    next();
  },
  logger: function(req, res, next){
    console.log("Request: " + req.method + ' ' +req.originalUrl);
    next();
  }
}
