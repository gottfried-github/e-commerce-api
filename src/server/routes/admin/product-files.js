import express from 'express'

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

    return {router}
}

export default main