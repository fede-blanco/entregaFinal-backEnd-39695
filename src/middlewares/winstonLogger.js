import winston from 'winston'
import config from '../config/config.js'

// valores personalizados para entrega
const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
}

let transports;

if(config.NODE_ENV === "production" ) {
    transports = [
        new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            level: "error",
            filename: "errors.log"
        })
    ]
} else {
    transports = [
        new winston.transports.Console({
            level: "debug",
        }),
        new winston.transports.File({
            level: "error",
            filename: "errors.log"
        })
    ]
}



export const winstonLogger = winston.createLogger({
    levels,
    transports
})

