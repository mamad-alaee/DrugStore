const {setLoggerfunc} = require("./startup/logger");
const express = require("express");
const app = express();
const {getBackup} = require("./startup/backup");
const cron = require("node-cron");

require("./startup/db")();
setLoggerfunc();
require("./startup/routersetup")(app);


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT , console.log(`istening to port ${PORT}`));

cron.schedule('*/10 * * * *',() => {getBackup()})



module.exports = server;


