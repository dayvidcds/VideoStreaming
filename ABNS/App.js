const db = require('./api/model/ConnectionDB')

const BalancerRepository = require('./api/model/BalancerRepository')
const BalancerBusiness = require('./api/business/BalancerBusiness')
const BalancerRouter = require('./api/routes/BalancerRouter')

const balancerRep = new BalancerRepository(db)
const balancerBus = new BalancerBusiness(balancerRep)
const balancerRouter = new BalancerRouter(balancerBus)

const express = require('express')
const app = express()

app.use('/balancer', balancerRouter.router)

app.use('/', (req, res) => {
    res.send('WELCOME TO ABNS!')
})

module.exports = app