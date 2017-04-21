const assert = require('assert')
const mockery = require('mockery')
const sinon = require('sinon')

describe('makeImage', function () {
  let makeImage
  let svg2png
  let readFile
  let writeFile

  beforeEach(function() {
    readFile = sinon
      .mock()
      .withArgs('input.svg')
      .yieldsAsync(null, 'input buffer')
    writeFile = sinon
      .mock()
      .withArgs('output.png')
      .yieldsAsync(null)
    svg2png = sinon
      .stub()
      .resolves('output buffer')

    mockery.enable({useCleanCache: true})
    mockery.registerMock('fs', { readFile, writeFile })
    mockery.registerMock('svg2png', svg2png)
    mockery.registerAllowable('../lib/make-image')

    makeImage = require('../lib/make-image')
  })

  afterEach(function () {
    mockery.deregisterAll()
    mockery.disable()
  })

  it('reads the input file', function () {
    return makeImage('input.svg', 'output.png')
      .then(() => {
        sinon.assert.calledWith(readFile, 'input.svg')
      })
  })

  it('pipes the input file into svg2png', function () {
    return makeImage('input.svg', 'output.png')
      .then(() => {
        sinon.assert.calledWith(svg2png, 'input buffer')
      })
  })

  it('pipes the output of svg2png to the output file', function () {
    return makeImage('input.svg', 'output.png')
      .then(() => {
        sinon.assert.calledWith(writeFile, 'output.png', 'output buffer')
      })
  })

  it('returns a failed promise if reading the input throws', function (done) {
    readFile.throws('readFile error')
    makeImage('input.svg', 'output.png')
      .catch((ex) => {
        assert.equal(ex, 'readFile error')
        done()
      })
  })

  it('returns a failed promise if reading the input fails', function (done) {
    let error = new Error('readFile error 2')
    readFile.yieldsAsync(error)

    makeImage('input.svg', 'output.png')
      .catch((ex) => {
        assert.equal(ex, 'readFile error')
        done()
      })
  })

  it('returns a failed promise if svg2png throws', function (done) {
    svg2png.throws('svg2png error')
    makeImage('input.svg', 'output.png')
      .catch((ex) => {
        assert.equal(ex, 'readFile error')
        done()
      })
  })
})
