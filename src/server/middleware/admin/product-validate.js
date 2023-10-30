import _validate from './product-validate-lib.js'

function create(req, res, next) {
    const errors = _validate(req.body)
    if (errors) return next(m.ValidationError.create("some fields are filled incorrectly", errors))

    return next()
}

function update(req, res, next) {
    if (req.body.write) {
        const errors = _validate(req.body.write)
        if (errors) return next(m.ValidationError.create("some fields are filled incorrectly", errors))

        return next()
    }

    return next()
}

export default () => ({validateCreate: create, validateUpdate: update})