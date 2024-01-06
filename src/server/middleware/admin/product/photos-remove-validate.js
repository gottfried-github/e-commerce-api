import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-remove.js'

export default () => (req, res, next) => {
    const errors = validate(req.body)

    if (!errors) next()

    next(m.ValidationError.create("some fields are filled incorrectly", errors.node))
}