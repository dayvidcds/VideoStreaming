const mongoose = require('mongoose')

class FilmRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            route_video: { type: String, required: true },
            tags: { type: [String], required: false },
            title: { type: String, required: true }
        })
        this.filmModel = this.connection.model('Films', this.schema)
    }

    insert(film) {
        return new Promise((resolve, reject) => {
            const filmRep = new this.filmModel(film)
            filmRep.save((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.filmModel.find({ tags: { $in: tags } }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }


    findAll() {
        return new Promise((resolve, reject) => {
            this.filmModel.find((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    findByName(title) {
        return new Promise((resolve, reject) => {
            this.filmModel.findOne({ title: { $eq: title } }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

}

module.exports = FilmRepository