import fs from 'fs/promises'
import path from 'path'

/**
 * @param {String} options.productUploadPath path to uploads dir, relative to options.root
 * @param {String} options.productDiffPath path, relative to which actual pathname of each uploaded file should be stored
 * @param {String} options.root absolute path to app's root
 * @param {String} options.productPublicPrefix should be prepended to file's public path
*/
function main(store, options) {
    return {
        create(fields) {
            return store.product.create(fields)
        },

        async update(id, fields) {
            const res = await store.product.update(id, {write: fields.write || null, remove: fields.remove || null})
            return store.product.getById(id)
        },

        getMany() {
            // see Products view in product spec
            return store.product.getMany(null, null, [{name: 'time', dir: -1}])
        },

        getById(id) {
            return store.product.getById(id)
        },

        async addPhotos(id, photos) {
            let _resPhotos = null
        
            let res = null
        
            try {
                res = await store.product.addPhotos(id, photos)
            } catch (eDb) {
                
                // remove photos files from the filesystem
                try {
                    for (const photo of photos) {
                        await fs.rm(path.join(options.root, photo.pathLocal))
                    }
                } catch (eFiles) {
                    const _e = new Error("adding photos to the database and removing respective files failed")

                    _e.errorDb = eDb
                    _e.errorFiles = eFiles
                }

                throw eDb
            }

            if (res !== true) throw new Error('store returned incorrect value')

            // get the product to send to the client
            return store.product.getById(id)
        }
    }
}

export default main