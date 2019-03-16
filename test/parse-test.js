const chai = require('chai')
const sinonChai = require('sinon-chai')

const endpoint = require('../dist')

const expect = chai.expect
chai.use(sinonChai)

describe('endpoint.parse()', () => {
  it('is a function', () => {
    expect(endpoint.parse).to.be.a('function')
  })

  it('README example', () => {
    const input = {
      method: 'get',
      url: '/orgs/:org/repos',
      org: 'octokit',
      type: 'private'
    }

    expect(endpoint(input)).to.deep.equal(endpoint.parse(endpoint.merge(input)))
  })

  it('does not alter input options', () => {
    const input = {
      method: 'get',
      url: '/',
      headers: {
        accept: 'application/vnd.github.v3+json'
      },
      mediaType: {
        previews: ['foo', 'bar']
      }
    }

    endpoint.parse(input)

    expect(input.headers.accept).to.equal('application/vnd.github.v3+json')
  })
})
