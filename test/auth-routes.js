import {assert} from 'chai'
import * as m from '../../fi-common/messages.js'

import {authenticate, signup} from '../src/routes/admin/auth.js'

class Req {
    log() {}
}

class Res {
    constructor(statusCb) {
        this._statusCb = statusCb
    }

    status(...args) {
        this._statusCb(...args)

        return this
    }

    json() {}
}

function testRoutes() {
    describe("dep resolves with InvalidCriterion", () => {
        it("assigns 400", async () => {
            let status = null
            
            await authenticate(new Req(), new Res((_status) => {status = _status}), () => {}, {authenticate: (req, res, next) => {
                return Promise.resolve(m.InvalidCriterion.create('message'))
            }})

            assert.strictEqual(status, 400)
        })
    })
    
    describe("dep resolves with ResourceNotFound", () => {
        it("assigns 404", async () => {
            let status = null
            
            await authenticate(new Req(), new Res((_status) => {status = _status}), () => {}, {authenticate: (req, res, next) => {
                return Promise.resolve(m.ResourceNotFound.create('message'))
            }})

            assert.strictEqual(status, 404)
        })
    })
}

export {testRoutes}