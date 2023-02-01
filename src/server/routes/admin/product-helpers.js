import * as m from '../../../../../fi-common/messages.js'

/**
 * @description deeply type-check the fields
*/
function ensureFields(body) {
    const fields = productStripFields(body)
    // const {expose, name, price, is_in_stock, photos_all, photos, cover_photo, description} = body

    const errors = {errors: [], node: {}}

    if (undefined !== fields.expose && 'boolean' !== typeof fields.expose) errors.node.expose = {errors: [new TypeError("'isInSale' must be boolean")], node: null}
    if (undefined !== fields.name && 'string' !== typeof fields.name) errors.node.name = {errors: [new TypeError("'name' must be a string")], node: null}
    if (undefined !== fields.price && 'number' !== typeof fields.price) errors.node.price = {errors: [new TypeError("'price' must be a number")], node: null}
    if (undefined !== fields.is_in_stock && 'boolean' !== typeof fields.is_in_stock) errors.node.is_in_stock = {errors: [new TypeError("'name' must be boolean")], node: null}
    if (undefined !== fields.photos_all && !Array.isArray(fields.photos_all)) errors.node.photos = {errors: [new TypeError("'photos' must be an array")], node: null}
    if (undefined !== fields.photos && !Array.isArray(fields.photos)) errors.node.photos = {errors: [new TypeError("'photos' must be an array")], node: null}
    if (undefined !== fields.cover_photo && 'string' !== typeof fields.cover_photo) errors.node.coverPhoto = {errors: [new TypeError("'cover_photo' must be a string")], node: null}
    if (undefined !== fields.description && 'string' !== typeof fields.description) errors.node.description = {errors: [new TypeError("'description' must be a string")], node: null}

    if (Array.isArray(fields.photos)) {
        for (const [i, photo] of fields.photos.entries()) {
            if ("string" !== typeof photo) {
                if (!errors.node.photos) {errors.node.photos = {errors: [], node: []}}
                errors.node.photos.node.push({index: i, errors: [new TypeError("children of 'photos' must be strings")], node: null})
            }
        }
    }
    
    if (Array.isArray(fields.photos_all)) {
        for (const [i, photo] of fields.photos_all.entries()) {
            if ("string" !== typeof photo) {
                if (!errors.node.photos_all) {errors.node.photos_all = {errors: [], node: []}}
                errors.node.photos_all.node.push({index: i, errors: [new TypeError("children of 'photos' must be strings")], node: null})
            }
        }
    }

    if (Object.keys(errors.node).length) return {
        fields: null, 
        errors: m.ValidationError.create('some fields are filled incorrectly', errors)
    }

    return {fields}
}

/**
 * @returns error if `expose` isn't specified
 * @description `expose` is required when creating
*/
function ensureFieldsCreate(body, {ensureFields}) {
    if (!('expose' in body)) return {
        fields: null, 
        errors: m.ValidationError.create('some fields are filled incorrectly', {
            errors: [], node: {expose: {errors: [m.FieldMissing.create("'expose' must be specified")], node: null}}
        })
    }

    return ensureFields(body)
}

/**
 * body not empty
*/
function ensureFieldsUpdate(body, {ensureFields}) {
    const fields = productStripFields(body)

    if (!Object.keys(fields).length) return {
        fields: null, 
        errors: m.ValidationError.create('some fields are filled incorrectly', {
            errors: [m.FieldMissing.create("at least one of the fields must be specified")], node: null
        })
    }

    return ensureFields(body)
}

function makeEnsureFieldsCreate(ensureFields) {
    return (req, res, next) => {
        const _res = ensureFields(req.body)

        if (!_res.fields) {
            if (!_res.errors) return next(new Error("ensureFieldsCreate must return either fields or errors"))
            return next(_res.errors)
        }

        req.body.fields = _res.fields
        next()
    }
}

function makeEnsureFieldsUpdate(ensureFields) {
    return (req, res, next) => {
        if (!req.body.write) {
            req.body.write = null
            return next()
        }

        const _res = ensureFields(req.body.write)
        
        if (!_res.fields) {
            if (!_res.errors) return next(new Error("ensureFieldsCreate must return either fields or errors"))
            return next(_res.errors)
        }

        req.body.write = _res.fields
        next()
    }
}

/**
 * get rid of additional fields
*/
function productStripFields(body) {
    const _fields = {}

    if ('expose' in body) _fields.expose = body.expose 
    if ('name' in body) _fields.name = body.name 
    if ('price' in body) _fields.price = body.price 
    if ('is_in_stock' in body) _fields.is_in_stock = body.is_in_stock 
    if ('photos' in body) _fields.photos = body.photos 
    if ('cover_photo' in body) _fields.cover_photo = body.cover_photo 
    if ('description' in body) _fields.description = body.description 

    return _fields
}

export {
    ensureFields,
    ensureFieldsCreate, ensureFieldsUpdate,
    makeEnsureFieldsCreate, makeEnsureFieldsUpdate,
}