const fs = require('fs')
const svg2png = require('svg2png')

module.exports = function (inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, (err, data) => {
      if (err) throw err
      svg2png(data)
        .then((buffer) => {
          fs.writeFile(outputFile, buffer, (err) => {
            if (err) throw err
            resolve()
          })
        })
        .catch(reject)
    })
  })
}
