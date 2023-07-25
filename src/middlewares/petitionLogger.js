import { winstonLogger } from "./winstonLogger.js";


export const petitionLogger = (req, res, next) => {
    winstonLogger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    req.logger = winstonLogger
    next()
}