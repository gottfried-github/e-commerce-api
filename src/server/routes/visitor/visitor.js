import {Router} from 'express'

import product from './product.js'

import {errorHandler} from '../../middleware/error-handler.js'

function visitor(store) {
    const router = Router()

    router.use('/product', product(store.product).router)
    router.use(errorHandler)

    return router
}

export default visitor