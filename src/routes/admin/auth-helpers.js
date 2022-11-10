import * as m from "../../../../fi-common/messages.js"

function handleInvalidPassword(e, req, res, next) {
    if (!e) return next()

    req.log("routes-admin-auth, handleInvalidPassword - e:", e)

    if (!(e instanceof m.Message)) return next(e)

    if (m.InvalidPassword.code === e.code) return res.status(400).json(e)
    return next(e)
}

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

export {handleInvalidPassword, ensureCredentials}