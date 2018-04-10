const mongoose = require('mongoose')

class NodeRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            address: { type: String, required: true },
            country_code: { type: String, required: false },
            country_name: { type: String, required: false },
            region_code: { type: String, required: false },
            region_name: { type: String, required: false },
            city: { type: String, required: false },
            tags: { type: [String], required: false }
        })
        this.nodeModel = this.connection.model('Node', this.schema)
    }

    insert(node) {
        return new Promise((resolve, reject) => {
            const nodeRep = new this.nodeModel(node)
            nodeRep.save((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.nodeModel.find((err, res) => {
                if (err) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    findByCountry(country) {
        return new Promise((resolve, reject) => {
            this.nodeModel.find({ country_name: country }, (err, res) => {
                if (err) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    findByAdress(address) {
        return new Promise((resolve, reject) => {
            this.nodeModel.findOne({ address: { $eq: address } }, (err, res) => {
                if (err || (res == null)) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    findByContent(tags) {
        return new Promise((resolve, reject) => {
            this.nodeModel.find({ tags: { $in: tags } }, (err, res) => {
                if (err) {
                    reject(error)
                }
                resolve(res)
            })
        })
    }

    remove(address) {
        return new Promise((resolve, reject) => {
            this.nodeModel.findOneAndRemove({ address: { $eq: address } }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })

    }

}

module.exports = NodeRepository