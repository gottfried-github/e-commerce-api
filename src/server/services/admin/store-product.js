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
            return services.storeProduct.getMany(null, null, [{name: 'time', dir: -1}])
        },

        getById(id) {
            return store.product.getById(id)
        },

        async addPhotos(id, photos) {
            let _resPhotos = null
        
            // write to Photo
            try {
                _resPhotos = await store.photo.createMany(photos)
            } catch(e) {
                if (m.ValidationError.code === e.code) {

                    // data was generated server-side so must be internal error
                    const _e = new Error(e.message)
                    _e.data = e

                    throw _e
                }

                throw e
            }

            // write to the product
            
            const _resProduct = await store.product.updatePhotos(id, _resPhotos)

            if (null === _resPhotos) return null
            // if (null === _resProduct) return res.status(400).json({message: 'photos saved but no document matched id'})

            // get the product to send to the client
            return store.product.getById(id)
        }
    }
}