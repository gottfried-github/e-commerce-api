import {Router} from 'express'

import {log, logger} from './logger.js'

import admin from './routes/admin/admin.js'
import visitor from './routes/visitor/visitor.js'

function api(services, middleware, options) {
    const router = Router()

    /* attach logger to express */
    router.use((req, res, next) => {
        req.log = log.bind(logger)
        next()
    })

    router.use('/admin', admin(services.admin, {...middleware.admin, ...middleware.common}, options))
    router.use(visitor(services.visitor, {...middleware.visitor, ...middleware.common}))

    return router
}

export {api}
