# ISSUE 1 JS Client dev doc

## To-do

## design-doc

### Features

- [x] auth service client
- [x] user service client
- [x] post service client
- [ ] channel service client
- [x] comment service client
- [x] feed service client
- [ ] release service client
- [x] search service client

## dev-log

### JS-DOM and it's fetch API implementation

It turns out, JS-DOM's fetch API  expects CORS headers to be present on all responses, not just the one for the OPTIONS pre-flight request. What's more, it freaks out (some times) if there's a white space character on the Bearer token. Lord knows what else's broken.

Some links:

- <https://github.com/jsdom/jsdom/issues/2024>

#### Solutions

1. Use node environment when testing
    - Not such a good idea since the main intended use of this package is in the react project.
2. Use node-fetch package to replace JSDom's fetch
3. Work around it's limitations.

#### Decision

Went with no. 3. I added CORS permissions in the REST server for all responses.

### Bug: trying to send multipart form images/files

After wrestling with this for two days, I've finally figured it out. The main issue was that if you don't have the filename header set on the file *part* [in a multipart form http request], it won't be treated as a file. And when working with *form-data*, if you use buffers when appending, it doesn't auto consider it a file and you'll have to explicitly set the filename.
