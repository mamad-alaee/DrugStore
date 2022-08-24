const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require('jsonwebtoken');


const userschema = new mongoose.Schema({

    name: {
        type: String,
        minlength: 2,
        maxlength: 50,
    },
    family: {
        type: String,
        minlength: 2,
        maxlength: 100,
    },
    number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    kind :{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "user_kind"
    }
});

userschema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        kind: this.kind,
        number: this.number,
        name: this.name,
        family: this.family,
    }, process.env.jwtPrivateKey);
    return token;
}

const user = mongoose.model("user", userschema);

function userValidator(data) {
    const schema = joi.object({
        name: joi.string().min(2).max(50),
        family: joi.string().min(2).max(100),
        password: joi.string().min(6).max(255).alphanum().required(),
        number: joi.string().length(11).required(),
        kind: joi.string().required(),
    });
    return schema.validate(data);
}

exports.userschema = userschema;
exports.user = user;
exports.userValidator = userValidator;

