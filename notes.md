# EnsureFields behavior on additional properties
Additional properties get silently removed.

## Todo
Program should stop execution and return error on additional fields.

If user provides additional fields, they may expect that those fields will be written into database and instead they are silently removed. Also, a typo might happen, in which case user intended to add a legal property but they won't be notified of the typo and the property they intended to write ends up not written.

In both cases, user should be informed that the additional property won't be written and operation should be discarded for user to correct their errors and retry.

# Unified http response format
## Todo
All responces have `status` and `message` properties - with, perhaps, additional properties - so that the client can always simply display the `message`. If there's extra info, the client can process that to their preference. An example of the latter is the `400` error, where the response contains details of the validation errors.

Also, that way data layer could adhere to this format and assign status to errors. Sometimes doing that is appropriate because data layer has more info on the details of the error. An example of this is in `auth`, when user already exists: the data layer (the `store` layer) has the info on which field the error regards to (MongoDb's `keyValue` property of the `11000` error).