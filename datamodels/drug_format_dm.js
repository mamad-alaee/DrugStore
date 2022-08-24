const mongoose = require("mongoose");
const joi = require("joi");


const drug_format_schema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    }

});




const drug_format = mongoose.model("drug_format", drug_format_schema);


function drug_format_validator(data) {
    const schema = joi.object({
        name: joi.string().required(),
    });
    return schema.validate(data);
}


exports.drug_format_schema = drug_format_schema;
exports.drug_format = drug_format;
exports.drug_format_validator = drug_format_validator;

