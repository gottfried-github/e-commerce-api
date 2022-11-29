import path from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs/promises'

import createError from 'http-errors'
import multer from 'multer'

/**
 * @param {String} uploadPath absolute path to uploads dir
*/
function main(uploadPath) {
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
    })})

    return upload
}

export default main