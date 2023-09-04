const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

const errorlogger = (err,next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    return(err);
}

module.exports = {errorHandler,errorlogger};