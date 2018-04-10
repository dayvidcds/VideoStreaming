const db = require('./api/model/ConnectionDB')
const IPABNS = '191.179.215.171'
const TOKENABNS = '@BC0'

const NodeRepository = require('./api/model/nodeRepository')
const NodeBusiness = require('./api/business/nodeBusiness')
const NodeRouter = require('./api/routes/nodeRouter')

const nodeRep = new NodeRepository(db)
const nodeBus = new NodeBusiness(nodeRep)
const nodeRouter = new NodeRouter(nodeBus)

const express = require('express')
const app = express()

app.use('/node', nodeRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO BALANCER!')
})

module.exports = app