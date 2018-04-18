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
            films: [{
                _id: false,
                route_video : { type : String },
                title : { type: String},
                tags : {type: [String]},
                num_views : [{region_name:String, views: Number}],
            }]
        })
        this.nodeModel = this.connection.model('Node', this.schema)
    }

    insertFilms(node){
//        films.forEach(film => {

        return new Promise((resolve, reject) => {
            //this.nodeModel.findOneAndUpdate({address: node.address}, {$addToSet: {films: {$each: node.films}}}, (err, res) => {

//this.nodeModel.findOneAndUpdate({address: address, 'films.title':{$in:['video 02']}}, {$addToSet: {films: {$each: node.films}}}, (err, res) => {

                console.log('FILMEEEEEEEEEEEE ' , node.films)

                this.nodeModel.findOneAndUpdate({address: node.address}, {$addToSet: {films: {$each: node.films}}}, {upsert: true}, (err, res) => {
                    if (err) {
                        reject(err);
                        return
                    }

                    console.log('____' + res)

                    resolve(res)
                })

        })
  //      })
    }

    updateTags(address, tags) {
        return new Promise((resolve, reject) => {

            console.log(address, tags)

            this.nodeModel.findOneAndUpdate({ address: address }, { $addToSet: { tags: { $each: tags } } }, (err, res) => {
                if (err) { reject(err); return }
                resolve(res)
            })
        })
    }

    insert(node) {
        return new Promise((resolve, reject) => {
            const nodeRep = new this.nodeModel(node)
            nodeRep.save((err, res) => {

                console.log('err, ' , err, ' res, ', res)

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

    findByAddress(address) {
        return new Promise((resolve, reject) => {
            this.nodeModel.findOne({ address:  address }, (err, res) => {
                if (err || res == null) {

                    console.log('err || res == null')

                    reject(err)
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

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.nodeModel.find({ 'tags': { $in: tags } }, { address: true, _id: false }, (err, res) => {
                if (err) {
                    reject(err)
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

    findByTags(tags) {
        console.log(tags)
        return new Promise((resolve, reject) => {
            this.nodeModel.aggregate([{
                $unwind: "$films"
            }, {
                $match:{
                    'films.tags': {$in:tags}
                }
            }], (err, res) => {
                if (err) {
                    reject(err)
                }
               // console.log(res)
                resolve(res)
            })})
    }
}

module.exports = NodeRepository