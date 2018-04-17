const fs = require('fs');
const request = require('request')
const config = require('../configs/server.json')

class FilmBusiness {

    constructor(filmRepository) {
        this.repository = filmRepository
    }

    insert(film) {
        return new Promise((resolve, reject) => {
            this.repository.insert(film).then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.repository.findAll().then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByTags(tags).then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    findByTitle(title) {
        return new Promise((resolve, reject) => {
            this.repository.findByName(title).then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    downloadMedia(address ,movie){
        return new Promise((resolve, reject) => {

            /* OBTER ENDERECO DO BALANCEADOR PELO DNS */

            const headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            const options = {
                url: config.dnsaddress + '/dns/findByAddress/' + config.blchostname,
                method: 'GET',
                headers: headers
            }

            // Start the request
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    // Print out the response body
                    console.log(body)

                    const address = JSON.parse(body)

                    const opts = {
                        url: 'http://' + address + `/filme/streaming/play/${movie.route_video}`,
                        method: 'GET',
                        headers: headers
                    }

                    request(opts, function(error, response) {
                        if (!error && response.statusCode == 206) {
                            fs.stat(movie.route_video, (err, stats) => {
                                if (!err) {
                                    console.log(stats);
                                    reject(`File ${movie.route_video} already exist`)
                                }
                                
                                const writeStream = fs.createWriteStream(movie.route_video)
                                
                                response.pipe(writeStream)

                                writeStream.on('finish', () => resolve({
                                    status: 'success',
                                    message: 'File download completely'
                                }));

                                writeStream.on('error', streamErr => reject(streamErr))
                            })
                        }
                    })
                }
            })
        })
    }

}

module.exports = FilmBusiness