import createError from 'http-errors'
import * as m from '../../fi-common/messages.js'
import {isValidBadInputTree} from '../../fi-common/helpers.js'

function errorHandler(e, req, res, next) {
    if (!e) return next()

    console.log('errorHandler, e:', e);

    // bodyParser generates these
    if (e instanceof createError.HttpError) { // somehow isHttpError is not a function...
    // if (createError.isHttpError(e)) {
        return res.status(e.status).json(e)
    }
    
    if (e instanceof Error) {
        // req.log("handleApiErrors, an instance of Error occured, the instance:", e)
        return res.status(500).json({message: e.message})
    }

    if (!isValidBadInputTree(e)) return res.status(500).json(m.InvalidErrorFormat.create())

    return res.status(400).json(e)
}

export {errorHandler}
