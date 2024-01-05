import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-remove.js'
import validateObjectId from '../../../lib/validate-objectId.js'

export default () => (req, res, next) => {
    const errorsPhotosIds = validate(req.body.photosIds)
    const errorsProductId = validateObjectId(req.body.productId)

    if (!errorsPhotosIds && !errorsProductId) next()

    next(m.ValidationError.create("some fields are filled incorrectly", {
        productId: errorsProductId?.node || null,
        photosIds: errorsPhotosIds?.node || null
    }))
}