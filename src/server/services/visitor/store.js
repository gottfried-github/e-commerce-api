import product from './store-product.js'

function main(store) {
  return {
    store: { product: product(store) },
  }
}

export default main
