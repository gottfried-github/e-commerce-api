import {assert} from 'chai'
import * as m from '../../fi-common/messages.js'

import {ensureFields, ensureFieldsCreate, ensureFieldsUpdate, makeEnsureFields} from '../src/routes/admin/product-helpers.js'

function testEnsureFieldsCreate() {
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
}

function testEnsureFieldsUpdate() {
    describe("given body with no spec fields", () => {
        it("returns FieldMissing for root", () => {
            const res = ensureFieldsUpdate({additionalProp: "x"}, {ensureFields: () => {}})
            
            assert(
                res.errors &&
                res.errors.errors.length === 1 &&
                m.FieldMissing.code === res.errors.errors[0].code, 
                "no errors or no FieldMissing and/or other errors"
            )
        })
        
        it("doesn't call ensureFields", () => {
            let wasCalled = false

            ensureFieldsUpdate({additionalProp: "x"}, {ensureFields: () => {wasCalled = true}})

            assert.strictEqual(wasCalled, false)
        })
    })

    describe("given body with at least one spec field", () => {
        it("calls ensureFields", () => {
            let wasCalled = false

            ensureFieldsUpdate({name: "some name"}, {ensureFields: () => {wasCalled = true}})

            assert.strictEqual(wasCalled, true)
        })
        
        it("calls ensureFields with passed data", () => {
            const data = {name: "some name"}
            let arg = null

            ensureFieldsUpdate({name: "some name"}, {ensureFields: (_arg) => {arg = _arg}})

            assert.deepEqual(arg, data)
        })
    })
}

function testMakeEnsureFields() {
    describe("gets called with cb", () => {
        it("produced method calls cb", () => {
            const body = {data: "some data"}
            let wasCalled = false

            makeEnsureFields(() => {
                wasCalled = true; 
                return {fields: true}
            })({body}, {}, () => {})

            assert.strictEqual(wasCalled, true)
        })
        
        it("produced method calls cb with passed data", () => {
            const body = {data: "some data"}
            let isEqual = false

            makeEnsureFields((_body) => {
                isEqual = body === _body; 
                return {fields: true}
            })({body}, {}, () => {})

            assert.strictEqual(isEqual, true)
        })
    })

    describe("cb returns errors", () => {
        it("produced method calls 'next' with errors", () => {
            const errors = "errors"
            let isEqual = false

            makeEnsureFields(() => {
                return {errors}
            })({}, {}, (_errors) => {isEqual = errors === _errors})

            assert.strictEqual(isEqual, true)
        })
    })

    describe("cb returns data", () => {
        it("assigns the data to req.body", () => {
            const fields = "fields", body = {}

            makeEnsureFields(() => {
                return {fields}
            })({body}, {}, () => {})

            assert.strictEqual(body.fields, fields)
        })
        
        it("calls 'next'", () => {
            let wasCalled = false

            makeEnsureFields(() => {
                return {fields: "fields"}
            })({body: {}}, {}, () => {wasCalled = true})

            assert.strictEqual(wasCalled, true)
        })
    })
}

export {testEnsureFieldsCreate, testEnsureFieldsUpdate, testMakeEnsureFields}