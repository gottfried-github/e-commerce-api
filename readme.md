# Description
Performs the function, defined [here](../readme.md#api)

The package produces an `express` router which you can attach to an `express` app. 

See [docs](./docs.md) for api specification.

# Express session
The router uses `passport` which requires `express-session`. So the app in which you use the router needs to use `express-session`.

# Arguments
## store
A storage implementation that adheres to the specification, defined [here](../readme.md#store)

## options
* `productUploadPath` (mandatory): absolute path to file upload directory