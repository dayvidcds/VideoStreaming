const express = require('express')
const bodyParser = require('body-parser')
const iplocation = require('iplocation')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const TOKEN = '@BC0'

class BalancerRouter {
    constructor(balancerBusiness) {
        this.balancerBusiness = balancerBusiness
        this.initializeRoutes()
        this.router = router
    }

    initializeRoutes() {

        router.post('/registerAuto', (req, res) => {
            const address = req.connection.remoteAddress
            const addressSplit = address.split(':')
            const token = req.body.token
            if (token == TOKEN) {
                iplocation(addressSplit[3])
                    .then((resp) => {
                        const balancer = {
                            address: addressSplit[3],
                            country_code: resp.country_code,
                            country_name: resp.country_name,
                            region_code: resp.region_code,
                            region_name: resp.region_name,
                            city: resp.city
                        }
                        this.balancerBusiness.insert(balancer)
                            .then((resp) => {
                                res.send(resp)
                            })
                            .catch((resp) => { <<
                                << << < HEAD
                                res.send('JÁ CADASTRADO!') ===
                                    === =
                                    res.send('JÁ EXISTE!') >>>
                                    >>> > balancer
                            })
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            } else {
                res.send('TOKEN INVÁLIDO!')
            }
            //res.send('ALOGO LOCO')
        })

        router.post('/registerManu', (req, res) => {
            const token = req.body.token
            if (token == TOKEN) {
                const balancer = {
                    address: req.body.address,
                    country_code: req.body.country_code,
                    country_name: req.body.country_name,
                    region_code: req.body.region_code,
                    region_name: req.body.region_name,
                    city: req.body.city
                }
                this.balancerBusiness.insert(balancer)
                    .then((resp) => {
                        res.send(resp)
                    })
                    .catch((resp) => {
                        res.send(resp)
                    })
            } else {
                res.send('TOKEN INVÁLIDO!')
            }
            //res.send('ALOGO LOCO')
        })

        router.get('/info', (req, res) => {
            const address = req.connection.remoteAddress
            const addressSplit = address.split(':')
            console.log(addressSplit[3])
            iplocation(addressSplit[3])
                .then((resp) => {
                    //console.log(resp)
                    res.send(resp)
                })
                .catch((err) => {
                    console.error(err)
                })
        })

        router.get('/findByAddress/:address', (req, res) => {
            const addressp = req.params.address
            this.balancerBusiness.findByAddress(addressp)
                .then((resp) => {
                    res.send(resp)
                })
                .catch((resp) => {
                    res.send('NÃO ENCONTRADO!')
                })
        })

        router.get('/findBalancers', (req, res) => {
            const address = req.connection.remoteAddress
            iplocation(address)
                .then((resp) => {
                    this.balancerBusiness.findByCountry(resp.country_name)
                        .then((v) => {
                            res.send(v)
                        })
                        .catch((v) => {
                            res.send(v)
                        })
                })
                .catch((err) => {
                    console.error(err)
                })
        })

    }

}

module.exports = BalancerRouter