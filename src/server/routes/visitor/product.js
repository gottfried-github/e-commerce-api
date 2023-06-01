import bodyParser from 'body-parser'
import {Router} from 'express'

import * as m from '../../../../../fi-common/messages.js'

import validate from './product-validate.js'

// see Sorting in product spec
const SORT_ORDER = [{name: 'is_in_stock', dir: -1}, {name: 'time', dir: -1}, {name: 'price', dir: 1}, {name: 'name', dir: 1}]

function product(storeProduct) {
    const router = Router()

    router.post('/get-many', bodyParser.json(), 
        // validate
        (req, res, next) => {
            const errors = validate(req.body)
            if (errors) return next(m.ValidationError.create("some fields are filled incorrectly", errors))

            return next()
        }, 
        async (req, res, next) => {
            if (!SORT_ORDER.map(i => i.name).slice(1).indexOf(req.body.name)) throw new Error('sortField must match one of the following fields: time, price, name')

            /* see Sorting in product spec */ 
            const sortOrder = [...SORT_ORDER]
            const sortFieldDefault = sortOrder.splice(SORT_ORDER.map(i => i.name).indexOf(req.body.name), 1)
            sortOrder.unshift({...sortFieldDefault, dir: req.body.dir})

            let products = null

            try {
                products = await storeProduct.getMany(true, req.body.inStock ? true : null, sortOrder)
            } catch(e) {
                return next(e)
            }

            res.json(products)
        }
    )

    return {router}
}

export default product