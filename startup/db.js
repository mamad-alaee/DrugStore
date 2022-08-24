const mongoose = require("mongoose");


module.exports = function () {
   mongoose.connect("mongodb://localhost/DrugStore")
       .then(res => console.log("connected to db"));
}


