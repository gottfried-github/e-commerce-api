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

        res.status(201).json(_res)
    })

    router.post('/remove', bodyParser.json(), async (req, res, next) => {
        let _res = null

        try {
            _res = await services.removePhotos(req.body.id, req.body.photos)
        } catch (e) {
            next(e)
        }

        res.status(201).json(_res)
    })

    return {router}
}

export default main