import {assert} from 'chai'
import createError from 'http-errors'
import {Req, Res} from './mocks.js'

import {_errorHandler} from '../src/error-handler.js'

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

    describe("isValidBadInputTree returns true", () => {
        it("assigns 400", () => {
            const status = 400
            let isEqual = false

            _errorHandler({}, new Req(), new Res((_status) => {isEqual = status === _status}), () => {}, {
                isValidBadInputTree: () => true
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("passed an Error", () => {
        it("assigns 500", () => {
            const status = 500
            let isEqual = false

            _errorHandler(new Error(), new Req(), new Res((_status) => {isEqual = status === _status}), () => {}, {
                isValidBadInputTree: () => false
            })

            assert.strictEqual(isEqual, true)
        })
    })
    
    describe("passed arbitrary value", () => {
        it("assigns 500", () => {
            const status = 500
            let isEqual = false

            _errorHandler({}, new Req(), new Res((_status) => {isEqual = status === _status}), () => {}, {
                isValidBadInputTree: () => false
            })

            assert.strictEqual(isEqual, true)
        })
    })
}

export {testHandler}