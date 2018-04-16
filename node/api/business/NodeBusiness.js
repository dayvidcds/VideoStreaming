const request = require('request')

class NodeBusiness {

    constructor(token) {
        this.token = token
    }

    findBalancer(DNSaddress, port, route) {
        const headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        const options = {
            url: 'http://' + DNSaddress + ':' + port + '/' + route,
            method: 'POST',
            headers: headers,
            form: { token: this.token }
        }
        return new Promise((resolve, reject) => {
            request(options, (error, response, body))
                .then((resp) => {
                    resolve(body.ipaddr)
                })
                .catch((resp) => {
                    reject(error)
                })
        })
    }

    register(DNSaddress, port, route) {
        const headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        const options = {
            url: 'http://' + DNSaddress + ':' + port + '/' + route,
            method: 'POST',
            headers: headers,
            form: { token: this.token }
        }
        return new Promise((resolve, reject) => {
            request(options, (error, response, body))
                .then((resp) => {
                    resolve(body.msg)
                })
                .catch((resp) => {
                    reject(error)
                })
        })
    }

}

module.exports = NodeBusiness