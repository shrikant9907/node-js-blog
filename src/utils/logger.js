const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug', // Different levels for production and development
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        ...(process.env.NODE_ENV === 'production'
            ? [new winston.transports.File({ filename: 'logs/app.log' })]  // Only log to file in production
            : []),
    ],
});

module.exports = logger;
