# Description
The API for [the e-commerce project]().

The package produces an `express` router which you can attach to an `express` app. 

See api specification [here](#specification).

# Express session
The router uses `passport` which requires `express-session`. So the app in which you use the router needs to use `express-session`.

# Arguments
* **store.** A storage implementation that adheres to the specification, defined [here](fi-app#store-api)
* **options**
    * `productUploadPath` (mandatory): absolute path to file upload directory

# Specification
## Content type
The responses are JSON-encoded. The `Content-Type` of responses is `application/json`.

## Errors
### Handling malformed requests
See [`body-parser` docs](http://expressjs.com/en/resources/middleware/body-parser.html#errors) for scenarios in which `body-parser` generates errors.

### Other errors
#### Bad input
* status: `400`,
* body: `ValidationError` with `tree` being `ajv-errors-to-data-tree`-formatted tree

#### Resource Exists
* status: `409`
* body: `ResourceExists` with `tree`, if any, being `ajv-errors-to-data-tree`-formatted tree

#### Internal Error
* status: `500`,
* body: 
```json
{
    message: "some message",
    <optional properties>
}
```

## Product
### create
url: `POST /api/admin/product/create`

#### request
* Content-Type: `application/json`
* body: `{
    name?: String,
    itemInitial?: ObjectId,
    isInSale: Boolean
}`

### update
url: `POST /api/admin/product/update:id` (e.g.: `/api/admin/product/update/an-id`)

#### request
* Content-Type: `application/json`,
* body: `{
    name?: String,
    itemInitial?: String,
    isInSale?: Boolean
}`

Note: at least one field in fields must be specified.

#### response
* success
    * status: `200`,
    * body: 
    ```json
        {
            message: "some message",
            doc: <the updated product>
        }
    ```
* invalid id
    * status: `400`,
    * body: as described in `Bad Input`
* no field
    * status: `400`,
    * body: `ValidationError` without `tree`

## Signup
url: `POST /api/admin/auth/signup`

### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

### response
* success
    * status: `201`
    * body: `{}`
* user name exists
    * status: `409`
    * body: as described in `Resource Exists`

## Login
url: `POST /api/admin/auth/login`

### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

### response
* success
    status: `200`
    body: `{message: "successfully logged in"}`
* user doesn't exist
    status: `404`
    body: `ResourceNotFound`
* incorrect password
    status: `400`
    body: `InvalidCriterion`