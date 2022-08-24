const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');

module.exports = function (req, res, next) {
  const resault = mongoose.isValidObjectId(req.params.id)

  if (!resault) return res.status(400).send({message : 'آیدی ارسال شده نامعتبر است'});
  next();

}
