const chai = require('chai')
const sinonChai = require('sinon-chai')

const endpoint = require('..')

const expect = chai.expect
chai.use(sinonChai)

describe('endpoint.defaults()', () => {
  it('is a function', () => {
    expect(endpoint.defaults).to.be.a('function')
  })

  it('README example', () => {
    const myEndpoint = endpoint.defaults({
      baseUrl: 'http://github-enterprise.acme-inc.com/api/v3',
      headers: {
        'user-agent': 'myApp/1.2.3',
        authorization: `token 0000000000000000000000000000000000000001`
      },
      org: 'my-project',
      per_page: 100
    })

    const options = myEndpoint(`GET /orgs/:org/repos`)

    expect(options).to.deep.equal({
      method: 'get',
      url: 'http://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos?per_page=100',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': 'myApp/1.2.3',
        authorization: `token 0000000000000000000000000000000000000001`
      }
    })
  })
})
