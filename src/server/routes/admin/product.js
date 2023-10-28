import bodyParser from 'body-parser'
import {Router} from 'express'

import * as m from '../../../../../e-commerce-common/messages.js'

import files from './product-files.js'

function product(services, middleware) {
    const router = Router()

    router.post('/create', bodyParser.json(), 
        middleware.validateCreate,
        // handle request
        async (req, res, next) => {
            // console.log('/api/admin/product/create, body.fields:', req.body.fields)

            let id = null
            try {
                id = await services.storeProduct.create(req.body)
            } catch(e) {
                return next(e)
            }

            res.status(201).json(id)
        }
    )

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.post('/update/:id', bodyParser.json(), 
        middleware.validateUpdate,
        // handle request
        async (req, res, next) => {
            let _res = null

            try {
                _res = await services.storeProduct.update(req.params.id, {write: req.body.write || null, remove: req.body.remove || null})
            } catch (e) {
                return next(e)
            }

            let doc = null

            try {
                doc = await services.storeProduct.getById(req.params.id)
            } catch (e) {
                return next(e)
            }

            res.status(200).json(doc)
        }
    )

    router.post('/delete', (req, res) => {
        res.send('/product-delete: endpoint is not implemented yet')
    })

    router.get('/get-many', async (req, res, next) => {
        let products = null

        try {
            // see Products view in product spec
            products = await services.storeProduct.getMany(null, null, [{name: 'time', dir: -1}])
        } catch(e) {
            return next(e)
        }

        res.json(products)
    })

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.get('/:id', async (req, res, next) => {
        // console.log('/api/admin/product/, req.query:', req.query);
        let _product = null
        try {
            _product = await services.storeProduct.getById(req.params.id)
        } catch(e) {
            return next(e)
        }

        if (null === _product) return res.status(404).json({message: "document not found"})
        res.json(_product)
    })

    router.use('/photos', files(services, {files: middleware.files}).router)

    return {router}
}

export default product
