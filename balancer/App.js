const db = require('./api/model/ConnectionDB')
const IPABNS = '192.168.43.196'
const PORT = '3000'
const TOKENABNS = '@BC0'

const NodeRepository = require('./api/model/nodeRepository')
const NodeBusiness = require('./api/business/nodeBusiness')
const NodeRouter = require('./api/routes/nodeRouter')

const nodeRep = new NodeRepository(db)
const nodeBus = new NodeBusiness(nodeRep)
const nodeRouter = new NodeRouter(nodeBus)

const request = require('request')
const express = require('express')
var bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/a', (req, res) => {
    const token = req.body.user
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
        url: 'http://191.179.215.171:3000/balancer/registerAuto',
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

module.exports = app