import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs/promises'

import createError from 'http-errors'
import express from 'express'
import multer from 'multer'

import * as m from '../../../../../e-commerce-common/messages.js'

/**
 * @param {String} paths.productUploadPath absolute path to uploads dir
 * @param {String} paths.productDiffPath absolute path relative to which actual pathname of each uploaded file should be stored
*/
function main(storePhoto, storeProduct, paths) {
    const upload = multer({storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            if (!req.body?.id) return cb(createError(400, "'id' field must precede 'files' in the formdata"))
            const dirPath = path.join(paths.productUploadPath, req.body.id)

            await fs.mkdir(dirPath, {recursive: true})

            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
        }
    })}).array('files', 200)

    const router = express.Router()

    router.post('/upload', upload, async (req, res, next) => {
        let _resPhotos = null
        
        // write to Photo
        try {
            _resPhotos = await storePhoto.createMany(req.files.map(file => {
                return {path: path.join('/', path.relative(paths.productDiffPath, file.path))}
            }))
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
            _resProduct = await storeProduct.updatePhotos(req.body.id, _resPhotos)
        } catch(e) {
            return next(e)
        }

        if (null === _resProduct) return res.status(400).json({message: 'photos saved but no document matched id'})

        // get the product to send to the client
        try {
            _resProduct = await storeProduct.getById(req.body.id)
        } catch(e) {
            return next(e)
        }

        res.status(201).json(_resProduct)
    })

    return {router}
}

export default main