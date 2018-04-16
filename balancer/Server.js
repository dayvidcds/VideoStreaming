const app = require('./App')

const ip = require('ip')

const configs = require('./api/configs/server.json')

const port = configs.myport

const server = app.listen(port, (err, res) => {
    let error = ''
    if (err) {
        console.log('Server Connection ERROR')
        error = err
        return
    }
    console.log('Server Connection SUCESS Started on: http://' + ip.address() + ':' + port)
    if (error !== '') {
        throw new Error(error)
    }
})

module.exports = server