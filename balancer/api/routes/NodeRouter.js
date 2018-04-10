const express = require('express')
const bodyParser = require('body-parser')
const iplocation = require('iplocation')
const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const TOKEN = '@BC0'

class nodeRouter {
    constructor(nodeBusiness) {
        this.nodeBusiness = nodeBusiness
        this.initializeRoutes()
        this.router = router
    }

    initializeRoutes() {

        router.post('/register', (req, res) => {
            const address = req.connection.remoteAddress
            const token = req.body.token
            const tags = req.body.tags
            if (token == TOKEN) {
                iplocation(address)
                    .then((resp) => {
                        const node = {
                            address: address,
                            country_code: resp.country_code,
                            country_name: resp.country_name,
                            region_code: resp.region_code,
                            region_name: resp.region_name,
                            city: resp.city,
                            tags: tags
                        }
                        this.nodeBusiness.insert(node)
                            .then((resp) => {
                                res.send(resp)
                            })
                            .catch((resp) => {
                                res.send(resp)
                            })
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            } else {
                res.send('TOKEN INVÁLIDO!')
            }
        })

        router.get('/info', (req, res) => {
            const address = req.connection.remoteAddress
            iplocation(address)
                .then((resp) => {
                    console.log(resp)
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

        router.get('/findContentByTag/:address', (req, res) => {
            const addressp = req.params.tags
            this.balancerBusiness.findByAddress(addressp)
                .then((resp) => {
                    res.send(resp)
                })
                .catch((resp) => {
                    res.send('NÃO ENCONTRADO!')
                })
        })

        router.get('/findnodes', (req, res) => {
            const address = req.connection.remoteAddress
            iplocation(address)
                .then((resp) => {
                    this.nodeBusiness.findByCountry(resp.country_name)
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

module.exports = nodeRouter