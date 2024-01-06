import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'

import * as m from '../../../../../../../e-commerce-common/messages.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const schema = {
    type: 'object',
    properties: {
        productId: {
            type: 'string',
            minLength: 1
        },
        photos: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                        minLength: 1
                    },
                    public: {
                        type: 'boolean'
                    }
                },
                required: ['id', 'public'],
                additionalProperties: false
            }
        },
        required: ['productId, photos'],
        additionalProperties: false
    }
}

const _validate = ajv.compile(schema)

function validate(photos) {
    if (_validate(photos)) return false

    const errors = toTree(_validate.errors, (e) => {
        if ('required' === e.keyword) return m.FieldMissing.create(e.message, e)
        if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)

        return m.ValidationError.create(e.message, null, e)
    })

    return errors
}

export {validate as default, _validate}