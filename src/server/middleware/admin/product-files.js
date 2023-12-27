import path from 'path'
import fs from 'fs/promises'
import createError from 'http-errors'
import multer from 'multer'
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * @param {String} options.productUploadPath path to uploads dir, relative to options.root
 * @param {String} options.productDiffPath path, relative to which actual pathname of each uploaded file should be stored
 * @param {String} options.root absolute path to app's root
*/
function main(options) {
    const multerMiddleware = multer({storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            if (!req.body?.id) return cb(createError(400, "'id' field must precede 'files' in the formdata"))
            const dirPath = path.join(
                options.root, 
                path.join(options.productUploadPath, req.body.id)
            )

            await fs.mkdir(dirPath, {recursive: true})
    
            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
        }
    })}).array('files', 200)

    const pathsTransformMiddleware = (req, res, next) => {
        req.filesPaths = req.files.map(file => {
            return {
                public: path.join(
                    '/', 
                    path.relative(
                        path.join(options.root, options.productDiffPath), 
                        file.path
                    )
                ),
                local: path.relative(options.root, file.path)
            }
        })

        next()
    }

    return [multerMiddleware, pathsTransformMiddleware]
}

export default main