import {Router} from 'express'

import admin from './routes/admin/admin.js'

function api(store) {
    const router = Router()

    router.use('/admin', admin(store))

    return router
}

export {api}
