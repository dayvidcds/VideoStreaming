const db = require('./api/model/ConnectionDB')
const IPABNS = '192.168.43.196'
const PORT = '3000'
const TOKENABNS = '@BC0'

const express = require('express')
const bodyParser = require('body-parser')

const NodeBusiness = require('./api/business/NodeBusiness')
const FilmBusiness = require('./api/business/FilmBusiness')
const FilmRepository = require('./api/model/FilmRepository')
const FilmRouter = require('./api/routes/FilmRouter')

const filmRep = new FilmRepository(db)
const filmBus = new FilmBusiness(filmRep)
const filmRouter = new FilmRouter(filmBus)

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.use((req, res, next) => {

    console.log(req.connection.remoteAddress)

    const address = req.connection.remoteAddress.split(':')
    const ad = address[3]
    const pa = 'http://' + 'localhost' + ':' + '2000'

    console.log('ENDEREÇO =>>> ', pa)

    res.setHeader('Access-Control-Allow-Origin', pa);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
})/*

app.use('/film', filmRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO VIDEO STREAM U.U!')
})

module.exports = app