import bodyParser from 'body-parser'
import {Router} from 'express'

import * as m from '../../../../../fi-common/messages.js'

import validate from './product-validate.js'
import files from './product-files.js'

function product(storeProduct, storePhoto, options) {
    const router = Router()

    router.post('/create', bodyParser.json(), 
        // validate
        (req, res, next) => {
            const errors = validate(req.body)
            if (errors) return next(m.ValidationError.create("some fields are filled incorrectly", errors))

            return next()
        }, 
        // handle request
        async (req, res, next) => {
            // console.log('/api/admin/product/create, body.fields:', req.body.fields)

            let id = null
            try {
                id = await storeProduct.create(req.body)
            } catch(e) {
                return next(e)
            }

            res.status(201).json(id)
        }
    )

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.post('/update/:id', bodyParser.json(), 
        // validate
        (req, res, next) => {
            if (req.body.write) {
                const errors = validate(req.body.write)
                if (errors) return next(m.ValidationError.create("some fields are filled incorrectly", errors))

                return next()
            }

            return next()
        }, 
        // handle request
        async (req, res, next) => {
            let _res = null

            try {
                _res = await storeProduct.update(req.params.id, {write: req.body.write || null, remove: req.body.remove || null})
            } catch (e) {
                return next(e)
            }

            let doc = null

            try {
                doc = await storeProduct.getById(req.params.id)
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
            products = await storeProduct.getMany()
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
            _product = await storeProduct.getById(req.params.id)
        } catch(e) {
            return next(e)
        }

        if (null === _product) return res.status(404).json({message: "document not found"})
        res.json(_product)
    })

    router.use('/photos', files(storePhoto, storeProduct, options).router)

    return {router}
}

export default product
