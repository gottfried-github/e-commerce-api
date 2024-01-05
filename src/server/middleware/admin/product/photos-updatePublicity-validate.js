import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-updatePublicity.js'

export default () => (req, res, next) => {
    const errors = validate(req.body.photos)

    if (!errors) next()

    next(m.ValidationError.create("some photos are invalid", errors.node))
}