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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/film', filmRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO VIDEO STREAM U.U!')
})

module.exports = app