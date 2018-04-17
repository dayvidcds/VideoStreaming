const db = require('./api/model/ConnectionDB')
//const IPABNS = '192.168.43.196'
//const PORT = '3000'
const TOKENABNS = '@BC0'

const NodeRepository = require('./api/model/nodeRepository')
const NodeBusiness = require('./api/business/nodeBusiness')
const NodeRouter = require('./api/routes/nodeRouter')

const app = express()

const ip = require('ip')

const configs = require('./api/configs/server.json')

const io = require('socket.io-client')
const myHostname = configs.myhostname
const myIPaddr = ip.address() + ':' + configs.myport
const socket = io(configs.dnsaddress)

const nodeRep = new NodeRepository(db)
const nodeBus = new NodeBusiness(nodeRep, socket)
const nodeRouter = new NodeRouter(nodeBus)

const request = require('request')
const express = require('express')
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    // console.log(req.connection.remoteAddress)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.post('/a', (req, res) => {
    const token = req.body.token
    console.log(token)
    res.send('alou')
})

app.use('/node', nodeRouter.router)

app.use('/', (req, res) => {
    // Set the headers
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    // Configure the request
    var options = {
        url: 'http://' + myIPaddr + ':3000/balancer/registerAuto',
        method: 'POST',
        headers: headers,
        form: { token: TOKENABNS }
    }

    // Start the request
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
        }
    })
    res.send('WELCOME TO BALANCER!')
})

socket.on('connect', ()=> {
    console.log( myHostname + '|' +  myIPaddr +' conectado ao DNS')
    socket.on('discover', (msg) => {
        console.log('new [discover] message from server > ' , msg )
        if(msg.discover === myHostname){
            socket.emit('discovered', {hostname: myHostname, ipaddr: myIPaddr})
        }
        //socket.emit('client response')
    })
})


module.exports = app