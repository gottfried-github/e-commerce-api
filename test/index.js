import {testHandler} from './error-handler.js'
import {testRoutes} from './auth-routes.js'
import {testEnsureFieldsCreate, testEnsureFieldsUpdate, testMakeEnsureFields} from './product-helpers.js'

describe("errorHandler", () => {
    testHandler()
})

describe("auth routes", () => {
    testRoutes()
})

describe("ensureFieldsCreate", () => {
    testEnsureFieldsCreate()
})

describe("ensureFieldsUpdate", () => {
    testEnsureFieldsUpdate()
})

describe("testMakeEnsureFields", () => {
    testMakeEnsureFields()
})