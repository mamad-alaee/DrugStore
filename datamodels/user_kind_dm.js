const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require('jsonwebtoken');


const user_kind_schema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    }

});




const user_kind = mongoose.model("user_kind", user_kind_schema);


function user_kind_validator(data) {
    const schema = joi.object({
        name: joi.string().required(),
    });
    return schema.validate(data);
}


exports.user_kind_schema = user_kind_schema;
exports.user_kind = user_kind;
exports.user_kind_validator = user_kind_validator;

