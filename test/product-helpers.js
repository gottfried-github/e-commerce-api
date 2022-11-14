import {assert} from 'chai'
import * as m from '../../fi-common/messages.js'

import {ensureFields, ensureFieldsCreate, ensureFieldsUpdate, makeEnsureFields} from '../src/routes/admin/product-helpers.js'

function testHelpers() {
    describe("ensureFieldsCreate", () => {
        describe("given no 'expose'", () => {
            it("returns FieldMissing for 'expose'", () => {
                const res = ensureFieldsCreate({name: 'some name'}, {ensureFields: () => {}})
    
                assert(
                    res.errors &&
                    'expose' in res.errors.node &&
                    res.errors.node.expose.errors.length === 1 &&
                    m.FieldMissing.code === res.errors.node.expose.errors[0].code, "no errors or no errors for 'expose' or no FieldMissing and/or other errors present"
                )
            })
    
            it("doesn't call ensureFields", () => {
                let wasCalled = false
    
                ensureFieldsCreate({name: 'some name'}, {ensureFields: () => wasCalled = true})
    
                assert.strictEqual(wasCalled, false)
            })
        })

        describe("given 'expose'", () => {
            it("calls ensureFields", () => {
                let wasCalled = false

                ensureFieldsCreate({expose: true, name: 'some name'}, {ensureFields: () => wasCalled = true})

                assert.strictEqual(wasCalled, true)
            })
            
            it("calls ensureFields with passed data", () => {
                const data = {expose: true, name: 'some name'}
                let arg = null

                ensureFieldsCreate(data, {ensureFields: (_arg) => arg = _arg})

                assert.deepEqual(arg, data)
            })
        })
    })
}

export {testHelpers}