const mongoose = require("mongoose");
const joi = require("joi");


const drug_kind_schema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    }

});




const drug_kind = mongoose.model("drug_kind", drug_kind_schema);


function drug_kind_validator(data) {
    const schema = joi.object({
        name: joi.string().required(),
    });
    return schema.validate(data);
}


exports.drug_kind_schema = drug_kind_schema;
exports.drug_kind = drug_kind;
exports.drug_kind_validator = drug_kind_validator;

