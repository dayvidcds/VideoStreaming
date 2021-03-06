const mongoose = require('mongoose')
const dbconfig = require('../configs/DBConfig.json')
let mongoConn = null

mongoose.Promise = global.Promise;

(() => {
    let error = ''
    const uri = 'mongodb://' + dbconfig.address + ':' + dbconfig.port + '/' + dbconfig.db
    mongoConn = mongoose.connect(uri, { useMongoClient: true }, (err) => {
        if (err) {
            error = err
        }
    })
    if (error !== '') {
        throw Error('erro no db')
    }
    console.log('Conectado ao DB!')
})()

module.exports = mongoConn