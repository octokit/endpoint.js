# endpoint.js

> Turns REST API endpoints into generic request options

`@octokit/endpoint` combines [GitHub REST API](https://developer.github.com/v3/)
with your options and turns them into generic request options which you can
then pass into your request library of choice.

## Usage

```js
const endpoint = require('@octokit/endpoint')

// Following GitHub docs formatting:
// https://developer.github.com/v3/repos/#list-organization-repositories
const options = endpoint('GET /orgs/:org/repos', {
  org: 'octokit',
  type: 'private'
})

// Alternativively, pass in a method and a url
const options = endpoint({
  // request options
  method: 'GET',
  url: '/orgs/:org/repos',
  // parameters
  org: 'octokit',
  type: 'private'
})

// options is now: {
//   method: 'GET',
//   url: 'https://api.github.com/orgs/octokit/repos?type=private',
//   headers: {
//     'user-agent': 'octokit/endpoint.js v1.2.3'
//   }
// }

// using with fetch (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
fetch(options.url, ...options)
// using with request (https://github.com/request/request)
request(options)
// using with got (https://github.com/sindresorhus/got)
got[options.method](options.url)
// using with axios
axios(options)
```

## Options

<table>
  <thead>
    <tr>
      <th>
        name
      </th>
      <th>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tr>
    <th>
      <code>baseUrl</code>
    </th>
    <td>
      String
    </td>
    <td>
      <strong>Required.</strong> Any supported <a href="https://developer.github.com/v3/#http-verbs">http verb</a>, case insensitive. <em>Defaults to <code>https://api.github.com</code></em>.
    </td>
  </tr>
    <th>
      <code>headers</code>
    </th>
    <td>
      Object
    </td>
    <td>
      Custom headers. Passed headers are merged with defaults:<br>
      <em><code>headers['user-agent']</code> defaults to <code>octokit-endpoint.js/1.2.3</code> (where <code>1.2.3</code> is the released version)</em>.<br>
      <em><code>headers['accept']</code> defaults to <code>application/vnd.github.v3+json</code>.<br>
    </td>
  </tr>
  <tr>
    <th>
      <code>method</code>
    </th>
    <td>
      String
    </td>
    <td>
      <strong>Required.</strong> Any supported <a href="https://developer.github.com/v3/#http-verbs">http verb</a>, case insensitive. <em>Defaults to <code>Get</code></em>.
    </td>
  </tr>
  <tr>
    <th>
      <code>url</code>
    </th>
    <td>
      String
    </td>
    <td>
      <strong>Required.</strong> A path or full URL which may contain <code>:variable</code> or <code>{variable}</code> placeholders,
      e.g. <code>/orgs/:org/repos</code>. The <code>url</code> is parsed using <a href="https://github.com/bramstein/url-template">url-template</a>.
    </td>
  </tr>
</table>

All other options will passed depending on the `method` and `url` options.

1. If the option key is a placeholder in the `url`, it will be used as replacement. For example, if the passed options are `{url: '/orgs/:org/repos', org: 'foo'}` the returned `options.url` is `https://api.github.com/orgs/foo/repos`
2. If the `method` is `GET` or `HEAD`, the option is passed as query parameter
3. Otherwise the parameter is passed as request body.

## endpoint.defaults()

Override or set default options. Example:

```js
const request = require('request')
const myEndpoint = require('@octokit/endpoint').defaults({
  baseUrl: 'http://github-enterprise.acme-inc.com/api/v3',
  headers: {
    'user-agent': 'myApp/1.2.3'
  },
  org: 'my-project',
  per_page: 100
})

request(myEndpoint(`GET /orgs/:org/repos`))
```

## LICENSE

[MIT](LICENSE)
