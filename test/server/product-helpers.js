import {assert} from 'chai'
import * as m from '../../../fi-common/messages.js'

import {ensureFields, ensureFieldsCreate, ensureFieldsUpdate, makeEnsureFieldsCreate, makeEnsureFieldsUpdate} from '../../src/server/routes/admin/product-helpers.js'

function testEnsureFieldsCreate() {
    describe("given no 'expose'", () => {
        it("returns FieldMissing for 'expose'", () => {
            const res = ensureFieldsCreate({name: 'some name'}, {ensureFields: () => {}})

            // console.log(res);
            assert(
                res.errors &&
                'expose' in res.errors.tree.node &&
                res.errors.tree.node.expose.errors.length === 1 &&
                m.FieldMissing.code === res.errors.tree.node.expose.errors[0].code, "no errors or no errors for 'expose' or no FieldMissing and/or other errors present"
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
                res.errors.tree.errors.length === 1 &&
                m.FieldMissing.code === res.errors.tree.errors[0].code, 
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

function testMakeEnsureFieldsCreate() {
    describe("gets called with cb", () => {
        it("produced method calls cb", () => {
            const body = {data: "some data"}
            let wasCalled = false

            makeEnsureFieldsCreate(() => {
                wasCalled = true; 
                return {fields: true}
            })({body}, {}, () => {})

            assert.strictEqual(wasCalled, true)
        })
        
        it("produced method calls cb with passed data", () => {
            const body = {data: "some data"}
            let isEqual = false

            makeEnsureFieldsCreate((_body) => {
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

            makeEnsureFieldsCreate(() => {
                return {errors}
            })({}, {}, (_errors) => {isEqual = errors === _errors})

            assert.strictEqual(isEqual, true)
        })
    })

    describe("cb returns data", () => {
        it("assigns the data to req.body", () => {
            const fields = "fields", body = {}

            makeEnsureFieldsCreate(() => {
                return {fields}
            })({body}, {}, () => {})

            assert.strictEqual(body.fields, fields)
        })
        
        it("calls 'next'", () => {
            let wasCalled = false

            makeEnsureFieldsCreate(() => {
                return {fields: "fields"}
            })({body: {}}, {}, () => {wasCalled = true})

            assert.strictEqual(wasCalled, true)
        })
    })
}

function testMakeEnsureFieldsUpdate() {
    describe("gets called with cb", () => {
        it("produced method calls cb", () => {
            const body = {write: {data: "some data"}}
            let wasCalled = false

            makeEnsureFieldsUpdate(() => {
                wasCalled = true; 
                return {fields: true}
            })({body}, {}, () => {})

            assert.strictEqual(wasCalled, true)
        })
        
        it("produced method calls cb with passed data", () => {
            const body = {write: {data: "some data"}}
            let isEqual = false

            makeEnsureFieldsUpdate((_body) => {
                isEqual = body.write === _body; 
                return {fields: true}
            })({body}, {}, () => {})

            assert.strictEqual(isEqual, true)
        })
    })

    describe("produced method is called with no 'write' property on 'body'", () => {
        it("doesn't call callback", () => {
            const isCalled = false
            
            makeEnsureFieldsUpdate(() => {
                isCalled = true
            })({body: {}}, {}, () => {})

            assert.strictEqual(isCalled, false)
        })
        
        it("calls 'next'", () => {
            let isCalled = null
            
            makeEnsureFieldsUpdate(() => {})({body: {}}, {}, () => {
                isCalled = true
            })

            assert.strictEqual(isCalled, true)
        })
        
        it("assigns 'null' to 'body.write'", () => {
            const body = {body: {}}
            
            makeEnsureFieldsUpdate(() => {})({body}, {}, () => {})

            assert.strictEqual(body.write, null)
        })
    })

    describe("cb returns errors", () => {
        it("produced method calls 'next' with errors", () => {
            const errors = "errors"
            let isEqual = false

            makeEnsureFieldsUpdate(() => {
                return {errors}
            })({body: {write: {}}}, {}, (_errors) => {isEqual = errors === _errors})

            assert.strictEqual(isEqual, true)
        })
    })

    describe("cb returns data", () => {
        it("assigns the data to req.body", () => {
            const fields = "fields", body = {write: {}}

            makeEnsureFieldsUpdate(() => {
                return {fields}
            })({body}, {}, () => {})

            assert.strictEqual(body.write, fields)
        })
        
        it("calls 'next'", () => {
            let wasCalled = false

            makeEnsureFieldsUpdate(() => {
                return {fields: "fields"}
            })({body: {write: {}}}, {}, () => {wasCalled = true})

            assert.strictEqual(wasCalled, true)
        })
    })
}

export {testEnsureFieldsCreate, testEnsureFieldsUpdate, testMakeEnsureFieldsCreate, testMakeEnsureFieldsUpdate}