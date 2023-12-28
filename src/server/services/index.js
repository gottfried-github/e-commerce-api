import storeAdmin from './admin/store.js'
import storeVisitor from './visitor/store.js'

function main(store, options) {
    return {
        admin: storeAdmin(store, options),
        visitor: storeVisitor(store)
    }
}

export default main