import * as m from "../../../../fi-common/messages.js"

// 1 in 'Function'/'inward'
function ensureCredentials(req, res, next) {
    const isName = 'name' in req.body, isPassword = 'password' in req.body

    if (isName && isPassword) return next()

    const errors = {errors: [], node: {}}

    if (!isName) {
        errors.node.name = {errors: [m.FieldMissing.create("'name' field is missing")], node: null}
    }

    if (!isPassword) {
        errors.node.password = {errors: [m.FieldMissing.create("'password' field is missing")], node: null}
    }

    return next(errors)
}

export {ensureCredentials}