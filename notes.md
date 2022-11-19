# EnsureFields behavior on additional properties
Additional properties get silently removed.

## Todo
Program should stop execution and return error on additional fields.

If user provides additional fields, they may expect that those fields will be written into database and instead they are silently removed. Also, a typo might happen, in which case user intended to add a legal property but they won't be notified of the typo and the property they intended to write ends up not written.

In both cases, user should be informed that the additional property won't be written and operation should be discarded for user to correct their errors and retry.

# Unified error format from data layer
## Todo
1. all errors are `Message`s, which have `code` and `message`
2. errors where tree is provided - such as `ValidationError` and, possibly, `ResourceExists` - have `tree` property

Api can pass these to the client and client can simply check for the `tree` property to know whether to display data for particular fields.