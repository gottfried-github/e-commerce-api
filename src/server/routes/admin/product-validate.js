import Ajv from 'ajv'
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
    description: {type: "string", minLength: 1, maxLength: 15000}
}

const schema = {
    oneOf: [
        {
            type: "object",
            properties: {
                expose: {type: "boolean", enum: [true]},
                ...rest
            },
            required: ['expose', 'name', 'price', 'is_in_stock', 'photos', 'cover_photo', 'description'],
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

    const errors = toTree(_validate.errors, () => {
        // see Which errors should not occur in the data
        if ('additionalProperties' === e.keyword) throw new Error("data contains fields, not defined in the spec")

        if ('required' === e.keyword) return m.FieldMissing.create(e.message, e)
        if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)

        return m.ValidationError.create(e.message, null, e)
    })

    filterErrors(errors)

    return errors
}

export default validate