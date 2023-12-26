import product from './store-product.js'
import auth from './store-auth.js'

function main(store) {
    return {
        store: {
            product: product({
                product: store.product
            }),
            auth: auth(store.auth)
        }
    }
}

export default main