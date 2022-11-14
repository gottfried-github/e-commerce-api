import bodyParser from 'body-parser'
import {Router} from 'express'
import {ensureFields, ensureFieldsCreate, ensureFieldsUpdate, makeEnsureFields} from './product-helpers.js'

function product(store) {
    const router = Router()

    router.post('/create', bodyParser.json(), makeEnsureFields((body) => {return ensureFieldsCreate(body, {ensureFields})}), async (req, res, next) => {
        // console.log('/admin/product/create, body.fields:', req.body.fields)

        let id = null
        try {
            id = await store.create(req.body.fields)
        } catch(e) {
            return next(e)
        }

        res.status(201).json(id)
        // res.send('/product-create: endpoint is not implemented yet')
    })

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.post('/update/:id', bodyParser.json(), makeEnsureFields((body) => {return ensureFieldsUpdate(body, {ensureFields})}), async (req, res, next) => {
        let doc = null

        try {
            doc = await store.update(req.params.id, req.body.fields)
        } catch (e) {
            return next(e)
        }

        res.status(200).json(doc)
        // res.send('/product-update: endpoint is not implemented yet')
    })

    router.post('/delete', (req, res) => {
        res.send('/product-delete: endpoint is not implemented yet')
    })

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.get('/:id', async (req, res, next) => {
        // console.log('/api/admin/product/, req.query:', req.query);
        let _product = null
        try {
            _product = await store.getById(req.params.id)
        } catch(e) {
            return next(e)
        }

        res.status(200).json(_product)
    })

    return router
}

export default product
