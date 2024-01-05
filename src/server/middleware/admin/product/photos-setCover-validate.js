import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-setCover.js'

export default () => (req, res, next) => {
    const errors = validate(req.body.photo)

    if (!errors) next()

    next(m.ValidationError.create("photo failed validation", errors.node))
}