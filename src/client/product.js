/**
 * @param {Object} _body
*/
async function create(_body, successCb, failureCb) {
    const res = await fetch('/api/admin/product/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(_body)
    })

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

/**
 * @param {String} id bson ObjectId-formatted id
 * @param {Object} _body
*/
async function update(id, _body, successCb, failureCb) {
    const res = await fetch(`/api/admin/product/update/${id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(_body)
    })

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

/**
 * @param {String} id bson ObjectId-formatted id
 * @param {Array} files File instances
 * @description wraps the data in FormData and sends to api
*/
async function upload(id, files, successCb, failureCb) {
    const form = new FormData()

    form.append('id', id)
    
    for (const file of files) {
        form.append('files', file)
    }

    const res = await fetch('/api/admin/product/photos/upload', {
        method: 'POST', body: form
    })

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

/**
 * @param {String} id id of product to get
*/
async function get(id) {
    const res = await fetch(`/api/admin/product/${id}`, {method: 'GET'})

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

export {create, update, upload, get}