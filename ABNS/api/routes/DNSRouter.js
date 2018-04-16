const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

class BalancerRouter {
    constructor(dnsBusiness) {
        this.dnsBusiness= dnsBusiness
        this.initializeRoutes()
        this.router = router
    }

    initializeRoutes() {

        router.get('/findByAddress/:address', (req, res) => {
            const hostname = req.params.address
            this.dnsBusiness.findServerByHostname(hostname)
                .then(ipaddr =>{
                    res.status(200).json(
                        {
                            status: 'success',
                            ipaddr: ipaddr
                        }
                    )
                })
                .catch(err =>{
                    res.json(
                        {
                            status: 'error',
                            error: err
                        }
                    )
                })
        })
    }
}

module.exports = BalancerRouter
