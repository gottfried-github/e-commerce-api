import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'

import * as m from '../../../../../../../e-commerce-common/messages.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const schema = {
    type: 'string',
    minLength: 1
}

const _validate = ajv.compile(schema)

function validate(objectId) {
    if (_validate(objectId)) return false

    const errors = toTree(_validate.errors, (e) => {
        return m.ValidationError.create(e.message, null, e)
    })

    return errors
}

export {validate as default, _validate}