import storeAdmin from './admin/store.js'
import storeVisitor from './visitor/store.js'

function main(store) {
    return {
        admin: storeAdmin(store),
        visitor: storeVisitor(store)
    }
}

export default main