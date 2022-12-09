import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs/promises'

import createError from 'http-errors'
import express from 'express'
import multer from 'multer'

async function recurse(data, cb, recurse) {
    if (1 === data.length) return await cb(data.pop())
    
    await cb(data.pop())
    
    return await recurse(data, cb, recurse)
}

/**
 * @param {String} uploadPath absolute path to uploads dir
*/
function main(storePhoto, storeProduct, uploadPath) {
    const upload = multer({storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            if (!req.body?.id) return cb(createError(400, "'id' field must precede 'files' in the formdata"))
            const dirPath = path.join(uploadPath, req.body.id)

            await fs.mkdir(dirPath, {recursive: true})

            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
        }
    })}).array('files', 200)

    const router = express.Router()

    router.get('upload', upload, async (req, res, next) => {
        let _resPhotos = null
        
        // write to Photo
        try {
            _resPhotos = await storePhoto.createMany(req.files.map(file => {
                return {path: file.path}
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
            await storeProduct.updatePhotos(req.body.id, _resPhotos)
        } catch(e) {
            return next(e)
        }

        res.status(201).json({message: 'successfully uploaded the photos'})
    })

    return {router}
}

export default main