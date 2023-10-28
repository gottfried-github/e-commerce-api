import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs/promises'

import createError from 'http-errors'
import express from 'express'
import multer from 'multer'

import * as m from '../../../../../e-commerce-common/messages.js'

function main(services, middleware) {
    const router = express.Router()

    router.post('/upload', middleware.files, async (req, res, next) => {
        let _resPhotos = null
        
        // write to Photo
        try {
            _resPhotos = await services.storePhoto.createMany(req.filesPublic)
        } catch(e) {
            if (m.ValidationError.code === e.code) {

                // data was generated server-side so must be internal error
                const _e = new Error(e.message)
                _e.data = e

                return next(_e)
            }

            return next(e)
        }

        let _resProduct = null

        // write to the product
        try {
            _resProduct = await services.storeProduct.updatePhotos(req.body.id, _resPhotos)
        } catch(e) {
            return next(e)
        }

        if (null === _resProduct) return res.status(400).json({message: 'photos saved but no document matched id'})

        // get the product to send to the client
        try {
            _resProduct = await services.storeProduct.getById(req.body.id)
        } catch(e) {
            return next(e)
        }

        res.status(201).json(_resProduct)
    })

    return {router}
}

export default main