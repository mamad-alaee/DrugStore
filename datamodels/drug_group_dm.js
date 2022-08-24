const mongoose = require("mongoose");
const joi = require("joi");


const drug_group_schema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    }

});




const drug_group = mongoose.model("drug_group", drug_group_schema);


function drug_group_validator(data) {
    const schema = joi.object({
        name: joi.string().required(),
    });
    return schema.validate(data);
}


exports.drug_group_schema = drug_group_schema;
exports.drug_group = drug_group;
exports.drug_group_validator = drug_group_validator;

