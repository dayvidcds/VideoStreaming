const app = require('./App')
const port = 3000

const server = app.listen(port, (err, res) => {
    let error = ''
    if (err) {
        console.log('Server Connection ERROR')
        error = err
        return
    }
    console.log('Server Connection SUCCESS Started on: http://' + 'localhost' + ':' + port)
    if (error !== '') {
        throw new Error(error)
    }
})

module.exports = server