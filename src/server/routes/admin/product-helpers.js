function filterErrors(errors) {
    // 1, 1.2 in Filtering out irrelevant errors
    const exposeErr = errors.node.expose?.errors.find(e => 'required' === e.data.keyword || 'type' === e.data.keyword)

    if (exposeErr) {
        traverseTree(errors, (e, fieldname) => {
            // 1.1, 1.2, 1.3 in Filtering out irrelevant errors
            if (_parseFirstOneOfItemPath(exposeErr.data.schemaPath) === _parseFirstOneOfItemPath(e.data.schemaPath) || 'required' === e.data.keyword && 'expose' !== fieldname || 'enum' === e.data.keyword) return null
        })

        return
    }

    // 2 in Filtering out irrelevant errors

    const redundantSchemas = []

    // store the schema of the 'enum' error
    traverseTree(errors, (e) => {
        if ('enum' === e.data.keyword) redundantSchemas.push(e.data.schemaPath)
    })

    const redundantOneOfSchemas = redundantSchemas.map(v => _parseFirstOneOfItemPath(v))

    // console.log("filterErrors, redundantSchemas:", redundantSchemas, JSON.stringify(errors, null, 2));

    // exclude the schemas that have the 'enum' error
    traverseTree(errors, (e) => {
        if (redundantOneOfSchemas.includes(_parseFirstOneOfItemPath(e.data.schemaPath))) return null
    })

    return
}

export default filterErrors