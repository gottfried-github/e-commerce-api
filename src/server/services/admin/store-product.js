function main(store) {
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
            } catch (e) {
                
                // remove photos files from the filesystem

                throw e
            }

            if (res !== true) throw new Error('store returned incorrect value')

            // get the product to send to the client
            return store.product.getById(id)
        }
    }
}

export default main