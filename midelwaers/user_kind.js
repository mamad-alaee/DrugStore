const {user_kind} = require("../datamodels/user_kind_dm");

module.exports = async function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (req.how && req.how === "pass"){
    return next();
  }
  const kind = await user_kind.findById(req.user.kind).select("name");
  if (!kind) return res.status(400).send({message : 'اطلاعات نامعتبر است'});
  if (kind.name !== "doctor") return res.status(403).send({message : 'دسترسی ممنوع'});
  next();
}