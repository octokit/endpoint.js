const chai = require('chai')
const sinonChai = require('sinon-chai')

const endpoint = require('..')

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
    const options1 = endpoint(input)
    const options2 = endpoint.parse(endpoint.options(input))

    expect(options1).to.deep.equal(options2)
  })
})
