import middleware from './middleware/index.js'

function main(store, options) {
    const middleware = middleware({store}, options)
}