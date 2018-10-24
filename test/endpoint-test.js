const chai = require('chai')
const getUserAgent = require('universal-user-agent')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)
const expect = chai.expect

const endpoint = require('..')

const pkg = require('../package.json')
const userAgent = `octokit-endpoint.js/${pkg.version} ${getUserAgent()}`

describe('endpoint()', () => {
  it('is a function', () => {
    expect(endpoint).to.be.a('function')
  })

  it('README example', () => {
    const options = endpoint({
      method: 'get',
      url: '/orgs/:org/repos',
      org: 'octokit',
      type: 'private'
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/orgs/octokit/repos?type=private',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('Pass route string as first argument', () => {
    const options = endpoint('GET /orgs/:org/repos', {
      org: 'octokit',
      type: 'private'
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/orgs/octokit/repos?type=private',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('Pass route string as first argument without options', () => {
    const options = endpoint('GET /')

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('Custom user-agent header', () => {
    const options = endpoint('GET /', {
      headers: {
        // also test that header keys get lowercased
        'User-Agent': 'my-app/1.2.3'
      }
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': 'my-app/1.2.3'
      }
    })
  })

  it('Full URL', () => {
    const options = endpoint('GET https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master')

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('Request body', () => {
    const options = endpoint('POST /repos/:owner/:repo/issues', {
      owner: 'octocat',
      repo: 'hello-world',
      headers: {
        accept: 'text/html;charset=utf-8'
      },
      title: 'Found a bug',
      body: "I'm having a problem with this.",
      assignees: [
        'octocat'
      ],
      milestone: 1,
      labels: [
        'bug'
      ]
    })

    expect(options).to.deep.equal({
      method: 'POST',
      url: 'https://api.github.com/repos/octocat/hello-world/issues',
      headers: {
        accept: 'text/html;charset=utf-8',
        'content-type': 'application/json; charset=utf-8',
        'user-agent': userAgent
      },
      body: {
        assignees: [
          'octocat'
        ],
        body: 'I\'m having a problem with this.',
        labels: [
          'bug'
        ],
        milestone: 1,
        title: 'Found a bug'
      }
    })
  })

  it('Put without request body', () => {
    const options = endpoint('PUT /user/starred/:owner/:repo', {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`
      },
      owner: 'octocat',
      repo: 'hello-world'
    })

    expect(options).to.deep.equal({
      method: 'PUT',
      url: 'https://api.github.com/user/starred/octocat/hello-world',
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`,
        accept: 'application/vnd.github.v3+json',
        'content-length': 0,
        'user-agent': userAgent
      },
      body: ''
    })
  })

  it('Query parameter template', () => {
    const options = endpoint('POST https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}', {
      name: 'example.zip',
      label: 'short description',
      headers: {
        'content-type': 'text/plain',
        'content-length': 14,
        authorization: `token 0000000000000000000000000000000000000001`
      },
      data: 'Hello, world!'
    })

    expect(options).to.deep.equal({
      method: 'POST',
      url: 'https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets?name=example.zip&label=short%20description',
      headers: {
        accept: 'application/vnd.github.v3+json',
        authorization: `token 0000000000000000000000000000000000000001`,
        'content-type': 'text/plain',
        'content-length': 14,
        'user-agent': userAgent
      },
      body: 'Hello, world!'
    })
  })

  it('URL with query parameter and aditional options', () => {
    const options = endpoint('GET /orgs/octokit/repos?access_token=abc4567', {
      type: 'private'
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/orgs/octokit/repos?access_token=abc4567&type=private',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('Set request body directly', () => {
    const options = endpoint('POST /markdown/raw', {
      data: 'Hello world github/linguist#1 **cool**, and #1!',
      headers: {
        accept: 'text/html;charset=utf-8',
        'content-type': 'text/plain'
      }
    })

    expect(options).to.deep.equal({
      method: 'POST',
      url: 'https://api.github.com/markdown/raw',
      headers: {
        accept: 'text/html;charset=utf-8',
        'content-type': 'text/plain',
        'user-agent': userAgent
      },
      body: 'Hello world github/linguist#1 **cool**, and #1!'
    })
  })

  it('Encode q parameter', () => {
    const options = endpoint('GET /search/issues', {
      q: 'location:Jyväskylä'
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/search/issues?q=location%3AJyv%C3%A4skyl%C3%A4',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })

  it('request parameter', () => {
    const options = endpoint('GET /', {
      request: {
        timeout: 100
      }
    })

    expect(options).to.deep.equal({
      method: 'GET',
      url: 'https://api.github.com/',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      },
      request: {
        timeout: 100
      }
    })
  })
})
