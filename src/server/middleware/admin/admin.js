import auth from './auth.js'
import product from './product-validate.js'
import files from './product-files.js'

function main(services, options) {
    return {
        auth: auth(services),
        product: product(),
        files: files(options)
    }
}

export default main