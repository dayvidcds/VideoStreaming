const db = require('./api/model/ConnectionDB')

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const path = require('path')

const IP = require('ip')

const config = require('./api/configs/server.json')

const myHostname = config.myhostname
const myIPaddr = '191.179.215.171' + ':' + config.myport
const publicDir = path.join(__dirname, './public/')

console.log('meu ip:' + myIPaddr)

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

const DNS = config.dnsaddress

const socket = io(DNS)

socket.on('connect', function() {
    console.log(myHostname + '|' + myIPaddr + ' connected to server')
    socket.on('discover', function(msg) {
        console.log('new message from server > ', msg)

        console.log('meu host :', myHostname, 'host req:', msg.discover)

        if (msg.discover === myHostname) {
            console.log('igual')
            socket.emit('discovered', { hostname: myHostname, ipaddr: myIPaddr })
        }

        //socket.emit('client response')
    })
})

const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

// Configure the request
const options = {
    url: DNS + '/dns/findByAddress/' + config.blchostname,
    method: 'GET',
    headers: headers
}

//console.log('URILLLLL', options.url)

// Start the request
request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        //console.log(body)
        //console.log('BOODYY  ', ipBusca.ipaddr)

        filmBus.findAll().then((resp) => {
            const headersInsert = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            const ipBusca = JSON.parse(body)

            //console.log('TAGS => ', resp)

            // console.log('RESP VIEWWW ', JSON.stringify(resp))
            //console.log('REGION NAME => ', config.regionname)

            const optionsInsert = {
                url: 'http://' + ipBusca.ipaddr + '/node/register',
                method: 'POST',
                headers: headersInsert,
                form: {
                    node: {
                        address: myHostname,
                        regionname: config.regionname,
                        token: '@BC0',
                        films: resp
                    }
                }
            }

            request(optionsInsert, function(error, response, body) {
                console.log('RESPOSTA => ', body)
            })

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
    res.sendFile(publicDir + './index.html')
})

module.exports = app