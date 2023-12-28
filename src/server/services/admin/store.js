import product from './store-product.js'
import auth from './store-auth.js'

function main(store, options) {
    return {
        store: {
            product: product({
                product: store.product, options
            }),
            auth: auth(store.auth)
        }
    }
}

export default main