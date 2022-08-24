const { createLogger, transports } = require('winston');
let logger ;
function setLogger() {

     logger = createLogger({
        transports: [
            new transports.File({filename: 'combined.log'})
        ],
        exceptionHandlers: [
            new transports.File({filename: 'exceptions.log'})
        ],
        rejectionHandlers: [
            new transports.File({filename: ' rejection.log'})
        ],
    });
}
module.exports.setLoggerfunc = setLogger;
module.exports.logger = logger;