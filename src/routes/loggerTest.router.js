import { Router } from "express";
import { winstonLogger } from "../middlewares/winstonLogger.js";

const loggerTestRouter = Router()


async function getLoggerTestController (req, res, next) {
        try {
            winstonLogger.debug(`DEBUG - ${new Date().toLocaleTimeString()}`)
            winstonLogger.http(`HTTP - ${new Date().toLocaleTimeString()}`)
            winstonLogger.info(`INFO - ${new Date().toLocaleTimeString()}`)
            winstonLogger.warning(`WARNING - ${new Date().toLocaleTimeString()}`)
            winstonLogger.error(`ERROR - ${new Date().toLocaleTimeString()}`)
            winstonLogger.fatal(`FATAL - ${new Date().toLocaleTimeString()}`)
            
        } catch (error) {
            winstonLogger.error(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
            throw new Error(` ${error.message} --> getLoggerTestController -- loggerTest.router.router.js`)
        }
}


loggerTestRouter.get("/", getLoggerTestController)

export default loggerTestRouter;