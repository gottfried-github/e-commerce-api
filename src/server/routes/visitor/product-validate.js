import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'

import * as m from '../../../../../fi-common/messages.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            enum: ['time', 'price', 'name']
        },
        dir: {
            type: 'number',
            enum: [-1, 1]
        },
        inStock: {type: 'boolean'},
    },
    required: ['name', 'dir', 'inStock'],
    additionalProperties: false,
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

    return errors
}

export default validate