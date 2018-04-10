const app = require('./App')
const port = 3000

const server = app.listen(port, '192.168.0.19', (err, res) => {
    let error = ''
    if (err) {
        console.log('Server Connection ERROR')
        error = err
        return
    }
    console.log('Server Connection SUCESS Started on: http://' + 'localhost' + ':' + port)
    if (error !== '') {
        throw new Error(error)
    }
})

module.exports = server