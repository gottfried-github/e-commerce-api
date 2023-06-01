import {Router} from 'express'

import {log, logger} from './logger.js'

import admin from './routes/admin/admin.js'
import visitor from './routes/visitor/visitor.js'

function api(store, options) {
    const router = Router()

    /* attach logger to express */
    router.use((req, res, next) => {
        req.log = log.bind(logger)
        next()
    })

    router.use('/admin', admin(store, options))
    router.use(visitor(store))

    return router
}

export {api}
