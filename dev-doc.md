# ISSUE 1 JS Client dev doc

## To-do

## design-doc

### Features

- [x] auth service client
- [ ] user service client
- [ ] post service client
- [ ] channel service client
- [ ] comment service client
- [ ] feed service client

## dev-log

### JS-DOM and it's fetch API implementation

It turns out, JSDOM's fetch API doesn't support wildcard header matching on the CORS headers. What's more, it freaks out (some times) if there's a white space character on the Bearer token. It also expects CORS headers to be persent on all responses, not just the one for the OPTIONS pre-flight request. Lord knows what else's broken.

Some links:

- <https://github.com/jsdom/jsdom/issues/2024>

#### Solutions

1. Use node enviroment when testing
    - Not such a good idea since the main intended use of this package is in the react project.
2. Use node-fetch package to replace JSDom's fetch
3. Work around it's limitations.

#### Descision

Went with no. 3. I added CORS permissions in the REST server for all responses.
