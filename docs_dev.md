# Money format
Fi deals with `kopiyka`s representation of `hrn`. E.g., `1.55` `hrn` is `155` `kopiyka`s. This is so because javascript calculates floating point numbers imprecisely. E.g.,
```javascript
0.1 + 0.2 // returns 0.30000000000000004
```
`1` in 'Notes'.

## Notes
1. See 'Pitfal #2: Floating point math' in `1`

## Refs
1. https://frontstuff.io/how-to-handle-monetary-values-in-javascript

# Date format
Date is stored in milliseconds since Unix epoch. This format is easily sortable by the database and on the front end is easily converted to human readable format with javascript builtin `Date`.