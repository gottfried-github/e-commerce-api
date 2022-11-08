import {Router} from 'express'

import {log, logger} from './logger.js'

import admin from './routes/admin/admin.js'

function api(store) {
    const router = Router()

    /* attach logger to express */
    router.use((req, res, next) => {
        req.log = log.bind(logger)
        next()
    })

    router.use('/admin', admin(store))

    return router
}

export {api}
