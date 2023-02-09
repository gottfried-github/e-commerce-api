# Description
The REST API for the [e-commerce project](https://github.com/gottfried-github/e-commerce-app). Work in progress: currently, there's no notion of orders or cart, etc.. Implemented is authentication (with [passport](http://www.passportjs.org/)); [data validation](#validation); CRUD routes and file upload logic for product; a [client library](#client) making it easier to make requests.

The package produces an `express` router which you can attach to an `express` app. 

* [REST API specification](#rest-api)
* [store API specification](#store-api)

# Usage
## Arguments
* **store.** A storage implementation that adheres to the [specification](#store-api)
* **options**
    * `productUploadPath` (mandatory): absolute path to file upload directory
    * `productDiffPath` (mandatory): absolute path relative to which actual pathname of each uploaded file should be stored

## Express session
The router uses [passport](http://www.passportjs.org/) which requires [express-session](https://www.npmjs.com/package/express-session). So the app in which you use the router needs to use [express-session](https://www.npmjs.com/package/express-session).

# Code overview
## Server
Routes are grouped into a number of [express](https://expressjs.com/) routers which are basically organized around store collections. The routers are all attached to the top router (see [the code](/src/server/routes/admin/admin.js)). Error handling is done in a centralized fashion, in [`_errorHandler`](https://github.com/gottfried-github/e-commerce-api/blob/master/src/server/error-handler.js) which maps the various errors to http status codes and sends them to the client.

### Validation
['ensureFields'](https://github.com/gottfried-github/e-commerce-api/blob/7bf8028537f3c967113374fa14439cf1326210f3/src/server/routes/admin/product-helpers.js#L6) does validation of incoming data and is invoked before other route handlers in the [express](https://expressjs.com/) handler chain.

#### Handling undefined fields: todo
Currently, the validation silently removes fields that are not defined in the specification. Now I think that this is a bad idea and the validation should instead throw an error when such a field occurs: if user provides additional fields, they may expect that those fields will be written into database and instead they are silently removed; also, a typo might happen, in which case user intended to add a legal field but they won't be notified of the typo and the field they intended to write ends up not written. In both cases, user should be informed that the additional field won't be written and operation should be discarded for user to correct their errors and retry.

#### Implementation: todo
The validation should probably be implemented using some sort of json-schema validator, like, say, [`ajv`](https://ajv.js.org/).

## Client
I [wrap](https://github.com/gottfried-github/e-commerce-api/tree/master/src/client) http requests to the api in a succint interface which can be used by a client application.

# Tests
`npm run test`

Authentication route handlers are unit tested as well as `_errorHandler` and product route-level validation.

# Specification
## Data structure
```json
{
  expose: Boolean,
  ... 
}
```
Whether all fields except `expose` are required depends on the value of `expose`: if it is `true` then the other fields are required, and if it is `false` then the other fields are not required.

### `photos_all` and `photos`
Product has `photos_all` and `photos` fields which are arrays of urls pointing to files on the server. The former represents all the photos that are uploaded to the server for the given product; the latter - the photos that are to be displayed to the visitor of the site.

## Messages
Messages represent the interface between the store and the api. They are abstracted away from the specifics of any particular database and describe what happens with records in general terms. 

All messages have `code` and `message` properties. Almost all messages have `data` property. Some messages also have additional properties.

The code for messages can be found [here]()

### ResourceNotFound
On read operation, a document satisfying a given query doesn't exist.

### ResourceExists
On write operation, a document with a given value already exists (e.g., a field with unique key).

### InvalidCriterion
* on read operation, a given query is syntactically invalid
* on update operation, a given query doesn't match any documents

### ValidationError
Document fails data validation. Has the `tree` property which describes the structure of the failed data in [ajv-errors-to-data-tree](https://www.npmjs.com/package/ajv-errors-to-data-tree) format.

## Store api
### create
#### parameters
  1. `fields`

#### behavior
* **success**: return id of created document
* **validation failure**: throw `ValidationError`

Any other error shall be treated as an internal error.

### update
#### parameters
  1. `id`
  2. `write`
  3. `remove`

#### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`
  * **validation failure**: throw `ValidationError`

Any other error shall be treated as an internal error.

### update photos
#### parameters
1. `id`
2. `photos`

#### behavior
* **success**: return `true`
* **invalid `id`**: throw `InvalidCriterion`
* **validation failure**: throw `ValidationError`
* **no document with given `id`**: return `null`

### delete
#### parameters
  1. `id`

#### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.

### getById
#### parameters
  1. `id`

#### behavior
  * **success**: return the found document
  * **no document found**: return `null`
  * **invalid id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.

## REST api
### The function of the api
**Inward.** Api transmits the received data over to the store. In doing so, it should make sure that:
1. appropriate fields exist in the received data
2. the values are of the correct type
3. fields that don't belong to data, don't exist

**Outward.** Assign status codes and messages to the output of the store and send it in response to the client.

### Content type
The responses are JSON-encoded. The `Content-Type` of responses is `application/json`.

### Errors
#### Handling malformed requests
See [`body-parser` docs](http://expressjs.com/en/resources/middleware/body-parser.html#errors) for scenarios in which [body-parser](https://www.npmjs.com/package/body-parser) generates errors.

#### Other errors
##### Bad input
* status: `400`,
* body: `ValidationError`

##### Invalid criterion
* status: `400`
* body: `InvalidCriterion`

##### Resource exists
* status: `409`
* body: `ResourceExists` with `tree`, if any, being [ajv-errors-to-data-tree](https://www.npmjs.com/package/ajv-errors-to-data-tree)-formatted tree

##### Internal error
* status: `500`,
* body: 
```json
{
    message: "some message",
    <optional properties>
}
```

### Product
#### create
url: `POST /api/admin/product/create`

##### request
* Content-Type: `application/json`
* body: 
```json
{
    expose: Boolean,
    name?: String,
    price?: Number,
    is_in_stock?: Boolean,
    photos_all?: Array,
    photos?: Array,
    cover_photo?: String,
    description?: String,
}
```

##### response
* success
    * status: `201`
    * body: the created document's id
* invalid data (no `expose` field, improper types or `ValidationError` on behalf of the store)
    * as described in [Bad Input](#bad-input)

#### update
url: `POST /api/admin/product/update:id` (e.g.: `/api/admin/product/update/an-id`)

##### request
* Content-Type: `application/json`,
* body: 
```json
{
    expose?: Boolean,
    name?: String,
    price?: Number,
    is_in_stock?: Boolean,
    photos_all?: Array,
    photos?: Array,
    cover_photo?: String,
    description?: String,
}
```

Note: at least one field in fields must be specified.

##### response
* success
    * status: `200`,
    * body: the updated document
* no field
    * status: `400`,
    * body: `ValidationError` without `tree`
* `ValidationError` on behalf of the store
    * as described in [Bad Input](#bad-input)
* `InvalidCriterion` on behalf of the store
    * as described in [Invalid criterion](#invalid-criterion)

### Signup
url: `POST /api/admin/auth/signup`

#### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

#### response
* success
    * status: `201`
    * body: 
        ```json
        {}
        ```
* user name exists
    * as described in [Resource exists](#resource-exists)

### Login
url: `POST /api/admin/auth/login`

#### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

#### response
* success
    status: `200`
    body: 
    ```json
    {message: "successfully logged in"}
    ```
* user doesn't exist
    status: `404`
    body: `ResourceNotFound`
* incorrect password
    * as described in [Invalid criterion](#invalid-criterion)