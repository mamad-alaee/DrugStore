const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');

module.exports = function (req, res, next) {

  const user_kind = req.body.kind;
  console.log(user_kind);
  if (!user_kind){
    console.log("in if1")
    req.how = "normal"
    return next();
  }
  else {
    console.log("in else1")
    if (user_kind === "doctor"){
      console.log("in if2")
      req.how = "normal"
      return next();
    }
    else {
      console.log("in else2")
      req.how = "pass"
      return next();
    }
  }

}
