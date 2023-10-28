function main(store) {
    // see Sorting in product spec
    const SORT_ORDER = [{name: 'is_in_stock', dir: -1}, {name: 'time', dir: -1}, {name: 'price', dir: 1}, {name: 'name', dir: 1}]

    return {
        getById(id) {
            return store.getById(id)
        },

        getMany(expose, inStock, sortField) {
            if (SORT_ORDER.map(i => i.name).slice(1).indexOf(sortField) < 0) throw new Error('sortField must match one of the following fields: time, price, name')

            /* see Sorting in product spec */ 
            const sortOrder = [...SORT_ORDER]
            const sortFieldDefault = sortOrder.splice(SORT_ORDER.map(i => i.name).indexOf(req.body.name), 1)[0]
            
            // keep 'is_in_stock' first, second put sortFieldDefault
            sortOrder.splice(1, 0, {...sortFieldDefault, dir: req.body.dir})

            return store.product.getMany(true, inStock ? true : null, sortOrder)
        }
    }
}