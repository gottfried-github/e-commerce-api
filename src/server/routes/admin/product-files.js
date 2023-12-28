import express from 'express'
import bodyParser from 'body-parser'

import * as m from '../../../../../e-commerce-common/messages.js'

function main(services, middleware) {
    const router = express.Router()

    router.post('/upload', middleware.files, async (req, res, next) => {
        let _res = null

        try {
            _res = await services.addPhotos(req.body.id, req.filesPaths.map(path => ({
                pathPublic: path.public,
                pathLocal: path.local
            })))
        } catch (e) {
            return next(e)
        }

        if (null === _res) return res.status(400).json({message: 'photos saved but no document matched id'})

        res.status(201).json(_res)
    })

    router.post('/remove', bodyParser.json(), async (req, res, next) => {
        console.log('/product/photos/remove, req.body:', req.body)

        try {
            await services.removePhotos(req.body.id, req.body.photos)
        } catch (e) {
            res.status(500).send('')
        }

        res.status(201).send('')

        // const doc = await services.getById(req.body.id)

        // res.status(201).json(doc)
    })

    return {router}
}

export default main