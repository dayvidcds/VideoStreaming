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




    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByTags(tags)
                .then(res =>{
                    resolve(res)
                }).catch(err => {
                reject(err)
            })
        })
    }

    initializeRoutes() {

        router.get('/findByTags/:tags/:region', (req, res) => {

            console.log(req.params.region)

            const tags = req.params.tags
            let ta = tags.replace(' ', '').split(',')
            //console.log('PARAMMM ==>>>', ta)
            this.nodeBusiness.findByTags(ta).then((resp) => {
                res.send(resp)
            }).catch((resp) => {
                res.send(resp)
            })
        })

        router.post('/insertFilms', (req, res) => {
            const node = req.body.node

            console.log(req.body.node)

            this.nodeBusiness.insertFilms(node)
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

            const node = req.body.node

            console.log(req.body.node)

            if (node.token == TOKEN) {

                console.log('passou token')

                const nodeN = {
                    address: node.address,
                    region_name: node.region_name,
                    films: node.films,

                }
                this.nodeBusiness.insert(nodeN)
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