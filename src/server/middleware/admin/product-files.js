import createError from 'http-errors'
import multer from 'multer'

/**
 * @param {String} options.productUploadPath absolute path to uploads dir
 * @param {String} options.productDiffPath absolute path relative to which actual pathname of each uploaded file should be stored
*/
function main(options) {
    const multerMiddleware = multer({storage: multer.diskStorage({
        destination: async (req, file, cb) => {
            if (!req.body?.id) return cb(createError(400, "'id' field must precede 'files' in the formdata"))
            const dirPath = path.join(options.productUploadPath, req.body.id)
    
            await fs.mkdir(dirPath, {recursive: true})
    
            cb(null, dirPath)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
        }
    })}).array('files', 200)

    const pathsTransformMiddleware = (req, res, next) => {
        req.filesPublic = req.files.map(file => {
            return {path: path.join('/', path.relative(options.productDiffPath, file.path))}
        })

        next()
    }

    return [multerMiddleware, pathsTransformMiddleware]
}

export default main