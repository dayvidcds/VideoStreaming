const db = require('./api/model/ConnectionDB')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const IP = require('ip')

const myHostname = 'no3.com'
const myIPaddr = IP.address() + ':3002'

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

const DNS = 'http://192.168.137.240:4000'

const socket = io(DNS)

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

const hostname = 'balancer01.com'

const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

// Configure the request
const options = {
    url: DNS + '/dns/findByAddress/' + hostname,
    method: 'GET',
    headers: headers
}

console.log('URILLLLL', options.url)

// Start the request
request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)

        const headersInsert = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        const ipBusca = JSON.parse(body)

        console.log('BOODYY  ', ipBusca.ipaddr)

        // Configure the request
        const optionsInsert = {
            url: 'http://' + ipBusca.ipaddr + '/node/register',
            method: 'POST',
            headers: headersInsert,
            form: { address: myHostname, region_name: 'caruaru', tags: ['acao', 'aventura', 'futurista'], token: '@BC0' }
        }

        request(optionsInsert, function(error, response, body) {
            console.log('RESPOSTA => ', body)
        })

    }
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