const express = require("express");
const auth_router = require("../routers/auth_router");
const user_router = require("../routers/user_router");
const drug_router = require("../routers/drug_router");
const cors = require('cors');



module.exports = function (app) {

    const corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200 ,
        allowedHeaders : "*",
        exposedHeaders : "x-auth-token",
        credentials : true
    }
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.static('public'));
    app.use("/api/user", user_router);
    app.use("/api/auth", auth_router);
    app.use("/api/drug", drug_router);

}