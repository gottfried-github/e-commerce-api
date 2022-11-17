import {assert} from 'chai'
import createError from 'http-errors'

import {isValidBadInputTree} from '../../fi-common/helpers.js'
import {_errorHandler} from '../src/error-handler.js'

class Req {
    log() {}
}

class Res {
    constructor(statusCb, jsonCb) {
        this._statusCb = statusCb || null
        this._jsonCb = jsonCb || null
    }

    status(...args) {
        if (this._statusCb) this._statusCb(...args)

        return this
    }

    json(...args) {
        if (this._jsonCb) this._jsonCb(...args)
    }
}

function testHandler() {
    describe("passed HttpError", () => {
        it("assigns same code as in error", () => {
            const status = 400, e = createError(400)
            let isEqual = false

            _errorHandler(e, new Req(), new Res((_status) => {isEqual = status === _status}), () => {}, {
                isValidBadInputTree: () => false
            })

            assert.strictEqual(isEqual, true)
        })
    })
}

export {testHandler}