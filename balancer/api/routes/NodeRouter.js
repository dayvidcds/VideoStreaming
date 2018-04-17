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

        router.post('/insertTags', (req, res) => {
            const tags = req.body.tags
            const address = req.body.address

            console.log(req.body)

            this.nodeBusiness.updateTags(address, tags)
                .then(result => {
                    res.json({
                        status: 'success',
                        msg: result
                    })
                })
                .catch(err => {
                    res.json({
                        status: 'error',
                        error: err
                    })
                })

        })

        router.post('/register', (req, res) => {
            const address = req.body.address
            const token = req.body.token
            const tags = req.body.tags
            const regionName = req.body.region_name

            console.log(req.body)

            if (token == TOKEN) {
                const node = {
                    address: address,
                    region_name: regionName,
                    tags: tags
                }
                this.nodeBusiness.insert(node)
                    .then((resp) => {
                        console.log('suc' + resp)
                        res.send(resp)
                    })
                    .catch((resp) => {
                        console.log('err' + resp)
                        res.send({
                            status: 'error',
                            error: 'JA EXISTE'
                        })
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

        router.get('/findContentByTags/:tags', (req, res) => {
            const tags = req.params.tags.replace(' ', '').split(',')
            this.nodeBusiness.findByTags(tags)
                .then(resp => {
                    res.send(resp)
                })
                .catch(err => {
                    res.send('NÃO ENCONTRADO!' + err)
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