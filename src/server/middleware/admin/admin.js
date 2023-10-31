import auth from './auth.js'
import authValidate from './auth-validate.js'
import product from './product-validate.js'
import files from './product-files.js'

function main(services, options) {
    return {
        auth: {
            auth: auth(services.store.auth),
            validate: authValidate()
        },
        product: product(),
        files: files(options)
    }
}

export default main