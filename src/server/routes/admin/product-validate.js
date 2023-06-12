import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'

import * as m from '../../../../../fi-common/messages.js'

import filterErrors from './product-helpers.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const rest = {
    name: {type: "string", minLength: 3, maxLength: 150},
    price: {type: "number", minimum: 0, maximum: 1000000},
    is_in_stock: {type: "boolean"},
    photos_all: {type: "array", maxItems: 500, minItems: 1, items: {type: "string", minLength: 1, maxLength: 1000}},
    photos: {type: "array", maxItems: 150, minItems: 1, items: {type: "string", minLength: 1, maxLength: 1000}},
    cover_photo: {type: "string", minLength: 1, maxLength: 1000},
    description: {type: "string", minLength: 1, maxLength: 15000},
    time: {type: "number", minimum: -86e14, maximum: 86e14}
}

const schema = {
    oneOf: [
        {
            type: "object",
            properties: {
                expose: {type: "boolean", enum: [true]},
                ...rest
            },
            required: ['expose', 'name', 'price', 'is_in_stock', 'photos', 'cover_photo', 'description', 'time'],
            additionalProperties: false
        },
        {
            type: "object",
            properties: {
                expose: {type: "boolean", enum: [false]},
                ...rest,
            },
            required: ['expose'],
            additionalProperties: false
        }
    ]
}

const _validate = ajv.compile(schema)

function validate(fields) {
    if (_validate(fields)) return false

    const errors = toTree(_validate.errors, (e) => {
        if ('required' === e.keyword) return m.FieldMissing.create(e.message, e)
        if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)

        return m.ValidationError.create(e.message, null, e)
    })

    filterErrors(errors)

    return errors
}

export {validate as default, _validate}