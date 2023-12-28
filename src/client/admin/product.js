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
 * @param {Object} write fields to write
 * @param {Array} remove fields to remove (`String`s)
*/
async function update(id, write, remove, successCb, failureCb) {
    const _body = {}
    if (write) _body.write = write
    if (remove) _body.remove = remove

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

async function removePhotos(id, photos, successCb, failureCb) {
    const res = await fetch('/api/admin/product/photos/remove', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id, photos
        })
    })

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

/**
 * @param {String} id id of product to get
*/
async function get(id, successCb, failureCb) {
    const res = await fetch(`/api/admin/product/${id}`, {method: 'GET'})

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

async function getMany(successCb, failureCb) {
    const res = await fetch(`/api/admin/product/get-many`, {method: 'GET'})

    const body = await res.json()

    if (!res.ok) return failureCb(body, res)
    return successCb(body, res)
}

export {create, update, upload, removePhotos, get, getMany}