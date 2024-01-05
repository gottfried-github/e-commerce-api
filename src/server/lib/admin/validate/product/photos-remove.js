import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'

import * as m from '../../../../../../../e-commerce-common/messages.js'

import filterErrors from '../../helpers.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const schema = {}

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