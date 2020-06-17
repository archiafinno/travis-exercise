const winston = require("winston");
const appRoot = require("app-root-path");

// const date = new Date();
// const year = date.getFullYear();
// const month = date.getMonth();
// const day = date.getDate();

const options = {
  file: {
    level: "info",
    filename: `${appRoot}/logger/logs/${year}/${month}/${year}-${month}-${day}.log`,
    // filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

const customLogger = (level, msg, req, payload) => {
  if (level === "info") {
    logger[level](`date: ${new Date()}, MSG: ${msg}, METHOD: ${req.method}, PATH: ${req.path}, BODY: ${JSON.stringify(req.body)}, PARAMS: ${JSON.stringify(req.params)}, QUERY: ${JSON.stringify(req.query)}, PAYLOAD: ${JSON.stringify(payload)}`);
  } else if (level === "error") {
    logger[level](`date: ${new Date()}, MSG: ${msg}, METHOD: ${req.method}, PATH: ${req.path}, BODY: ${JSON.stringify(req.body)}, PARAMS: ${JSON.stringify(req.params)}, QUERY: ${JSON.stringify(req.query)}`);
  }
};
module.exports = { logger, customLogger };
