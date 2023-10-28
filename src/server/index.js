import middleware from './middleware/index.js'
import services from './services/index.js'
import routes from './routes/index.js'

function main(store, options) {
    const services = services(store)
    const middleware = middleware(services, options)

    const router = routes(services, middleware)
}