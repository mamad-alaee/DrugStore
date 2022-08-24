const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require('jsonwebtoken');


const drug_schema = new mongoose.Schema({
    name: {
        type: String,
        require : true,
    },
    symbol: {
        type: String,
        require : true,

    },
    kind :{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "drug_kind"
    },
    group :{
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "drug_group"
    },
    description: {
        type: String,
        required: true,
    },
    irc: {
        type: Number,
        required: true,
    },
    genericId: {
        type: Number,
        required: true,
    },
    erx: {
        type: Number,
        required: true,
    },
    insuranceCover :{
        type: String,
        enum: ['y', 'n'],
        default: 'n',
        required: true,
    },
    validSince: {
        type: Number,
        required: true,
        length : 8,
    },
    validUntil: {
        type: Number,
        required: false,
    },
    price : {
        type : Number,
        required : true,
    },
    basePrice : {
        type : Number,
        required : true,
    },
    format : {
        type : mongoose.Schema.Types.ObjectId,
        require : true,
        ref : "drug_format"
    },
    searchTerm : {
        type : String,
        required : true
    }


});

drug_schema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        _id: this._id,
        kind: this.kind,
        number: this.number,
        name: this.name,
        family: this.family,
    }, process.env.jwtPrivateKey);
    return token;
}

const drug = mongoose.model("drug", drug_schema);

function drugValidator(data) {
    const schema = joi.object({
        name: joi.string().required(),
        symbol: joi.string().required(),
        kind: joi.object().required(),
        group: joi.object().required(),
        description: joi.string().required(),
        irc: joi.number().required(),
        genericId: joi.number().required(),
        erx: joi.number().required(),
        insuranceCover: joi.string().min(1).max(1).required(),
        validSince: joi.number().min(13000000).max(15000000).required(),
        validUntil: joi.number(),
        price: joi.number().required(),
        basePrice: joi.number().required(),
        format: joi.object().required(),
        searchTerm: joi.string().required(),
    });
    return schema.validate(data);
}

exports.drug_schema = drug_schema;
exports.drug = drug;
exports.drugValidator = drugValidator;

