import storeAdmin from './admin/store.js'
import storeVisitor from './visitor/store.js'

function main(store) {
    return {
        admin: {store: storeAdmin(store)},
        visitor: {store: storeVisitor(store)}
    }
}

export default main