const db = require('./api/model/ConnectionDB')
const IPABNS = '191.179.215.171'
const PORT = '3000'
const TOKENABNS = '@BC0'

const NodeRepository = require('./api/model/nodeRepository')
const NodeBusiness = require('./api/business/nodeBusiness')
const NodeRouter = require('./api/routes/nodeRouter')

const nodeRep = new NodeRepository(db)
const nodeBus = new NodeBusiness(nodeRep)
const nodeRouter = new NodeRouter(nodeBus)

const request = require('request');
const express = require('express')
const app = express()

app.get('/up', (req, res, next) => {

    const myJSONObject = { token: TOKENABNS }
        /*request({
                url: 'http://' + IPABNS + ':' + PORT + '/balancer/register',
                json: { token: TOKENABNS },
                method: "POST",
                json: true, // <--Very important!!!
                body: myJSONObject
            },
            function(error, response, body) {
                console.log(response);
            })*/

    return res.redirect(301, 'http://' + IPABNS + ':' + PORT + '/balancer/register/' + TOKENABNS)
    next()

})

app.use('/node', nodeRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO BALANCER!')
})

module.exports = app