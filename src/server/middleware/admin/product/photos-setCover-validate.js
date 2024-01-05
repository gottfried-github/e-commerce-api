import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-setCover.js'
import validateObjectId from '../../../lib/validate-objectId.js'

export default () => (req, res, next) => {
    const errorsPhoto = validate(req.body.photo)
    const errorsProductId = validateObjectId(req.body.productId)

    if (!errorsPhoto && !errorsProductId) next()

    next(m.ValidationError.create("some fields are filled incorrectly", {
        productId: errorsProductId?.node || null,
        photo: errorsPhoto?.node || null
    }))
}