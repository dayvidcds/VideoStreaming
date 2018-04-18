const mongoose = require('mongoose')

class FilmRepository {
    constructor(connection) {
        this.connection = connection
        this.schema = new mongoose.Schema({
            route_video: { type: String, required: true },
            tags: { type: [String], required: false },
            title: { type: String, required: true },
            num_views: { type: [{ region_name: String, views: Number }], required: false }
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

    addRegionInViews(region, title) {
        return new Promise((resolve, reject) => {
            this.filmModel.findOneAndUpdate({
                title: title
            }, {
                $push: {
                    num_views: {
                        region_name: region,
                        views: 1
                    }
                }
            }, { upsert: true }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    addViews(region, film) {
        return new Promise((resolve, reject) => {
            this.filmModel.update({
                'num_views.region_name': region,
                'title': film
            }, {
                '$inc': { 'num_views.$.views': 1 }
            }, (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.filmModel.find({ 'tags': { $in: tags } }, (err, res) => {
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

    findTags() {
        return new Promise((resolve, reject) => {
            this.filmModel.aggregate([{
                $unwind: '$tags'
            }, {
                $group: {
                    _id: null,
                    _tags: { $addToSet: '$tags' }
                }
            }], (err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res[0])
            })
        })
    }

    findViewsByRegion(region, filmTitle) {
        return new Promise((resolve, reject) => {
            this.filmModel.find({ title: filmTitle, 'num_views.region_name': region }, (err, res) => {
                //console.log('ERRO -=:>', err, 'RESS=>', res)
                if (err || res[0] == undefined) {
                    // console.log('ERRO NA BUSCAAA')
                    reject(err)
                }
                // console.log('passou if errooor. indo pra resolve')
                resolve(res)
            })
        })
    }

    findFilmsReduce() {
        return new Promise((resolve, reject) => {
            this.filmModel.aggregate([{ $project: { title: 1, route_video: 1, tags: 1, _id: 0 } }], (err, res) => {
                if (err || res[0] == undefined) {
                    reject(err)
                }
                resolve(res)
            })
        })
    }

}

module.exports = FilmRepository