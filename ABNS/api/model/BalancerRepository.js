const mongoose = require('mongoose')

class BalancerRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            address: { type: String, required: true },
            country_code: { type: String, required: false },
            country_name: { type: String, required: false },
            region_code: { type: String, required: false },
            region_name: { type: String, required: false },
            city: { type: String, required: false }
        })
        this.balancerModel = this.connection.model('Balancers', this.schema)
    }

    insert(balancer) {
        return new Promise((resolve, reject) => {
            const balancerRep = new this.balancerModel(balancer)
            balancerRep.save((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.balancerModel.find((err, res) => {
                if (err) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    findByCountry(country) {
        return new Promise((resolve, reject) => {
            this.balancerModel.find({ country_name: { $eq: country } }, (err, res) => {
                if (err) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    findByAddress(address) {
        return new Promise((resolve, reject) => {
            this.balancerModel.findOne({ address: { $eq: address } }, (err, res) => {
                if (err || (res == null)) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    remove(address) {
        return new Promise((resolve, reject) => {
            this.balancerModel.findOneAndRemove({ address: { $eq: address } }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })

    }

}

module.exports = BalancerRepository