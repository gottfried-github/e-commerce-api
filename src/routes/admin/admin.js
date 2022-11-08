import {Router} from 'express'
// import passport from 'passport'

// import authService from '../../services/auth.js'

// import auth from './auth.js'
import product from './product.js'

import {errorHandler} from '../../error-handler.js'

function admin(store) {
    const router = Router()

    /* partially setup passport */
    // router.use(passport.initialize())
    // router.use(passport.session())

    /* setup routes */
    // router.use('/auth', auth(authService(store.auth)))
    // router.use((req, res, next) => {
    //     req.log('/api/admin, req.user:', req.user)
    //     if (!req.user) {
    //         // see "HTTP authentication, passportjs", in notes
    //         res.set({'WWW-Authenticate': 'Basic'})
    //         return res.status(401).json({message: "the request is not authenticated"})
    //     }
    
    //     next()
    // })

    router.use('/product', product(store.product))

    /* central error handling */
    router.use(errorHandler)

    return router
}

export default admin