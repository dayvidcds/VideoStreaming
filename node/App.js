const db = require('./api/model/ConnectionDB')

const express = require('express')
const bodyParser = require('body-parser')

const IP = require('ip')

const myHostname = 'no1.com'
const myIPaddr = IP.address() + ':3000'

console.log(myIPaddr)

var io = require('socket.io-client')

const NodeBusiness = require('./api/business/NodeBusiness')
const FilmBusiness = require('./api/business/FilmBusiness')
const FilmRepository = require('./api/model/FilmRepository')
const FilmRouter = require('./api/routes/FilmRouter')

const filmRep = new FilmRepository(db)
const filmBus = new FilmBusiness(filmRep)
const filmRouter = new FilmRouter(filmBus)

const app = express()

const socket = io('http://192.168.137.240:4000')

socket.on('connect', function() {
    console.log(myHostname + '|' + myIPaddr + ' connected to server')
    socket.on('discover', function(msg) {
        console.log('new message from server > ', msg)
        if (msg.discover === myHostname) {
            socket.emit('discovered', { hostname: myHostname, ipaddr: myIPaddr })
        }

        //socket.emit('client response')
    })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    // console.log(req.connection.remoteAddress)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use('/film', filmRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO VIDEO STREAM U.U!')
})

module.exports = app