import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-updatePublicity.js'
import validateObjectId from '../../../lib/validate-objectId.js'

export default () => (req, res, next) => {
    const errorsPhotos = validate(req.body.photos)
    const errorsProductId = validateObjectId(req.body.productId)

    if (!errorsPhotos && !errorsProductId) next()

    next(m.ValidationError.create("some fields are filled incorrectly", {
        productId: errorsProductId?.node || null,
        photos: errorsPhotos?.node || null
    }))
}