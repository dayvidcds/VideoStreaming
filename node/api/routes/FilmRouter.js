const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const router = express.Router()
const path = require('path')
const request = require('request')

const config = require('../configs/server.json')

const publicDir = path.join(__dirname, '../../public/')

const DNS = config.dnsaddress
const hostname = config.blchostname
const myHostname = config.myhostname

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

class FilmRouter {
    constructor(filmBusiness) {
        this.filmBusiness = filmBusiness
        this.initializeRoutes()
        this.router = router
    }

    initializeRoutes() {

        router.post('/insert', (req, res) => {
            const film = {
                route_video: req.body.route_video,
                tags: req.body.tags.replace(' ', '').split(','),
                title: req.body.title,
                legend: req.body.legend
            }
            this.filmBusiness.insert(film).then((resp) => {

                const headers = {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

                const options = {
                    url: DNS + '/dns/findByAddress/' + hostname,
                    method: 'GET',
                    headers: headers
                }

                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        const headersInsert = {
                            'User-Agent': 'Super Agent/0.0.1',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }

                        const ipBusca = JSON.parse(body)

                        //console.log('BOODYY  ', ipBusca.ipaddr)

                        const optionsInsert = {
                            url: 'http://' + ipBusca.ipaddr + '/node/insertFilms',
                            method: 'POST',
                            headers: headersInsert,
                            form: { node: { address: myHostname, region_name: config.regionname, films: [film] } }
                        }

                        request(optionsInsert, function(error, response, body) {
                            console.log('RESPOSTA => ', body)
                        })

                    }
                })
                res.send('INSERIDO!<br>' + resp)
            }).catch((resp) => {
                res.send('ERRO => ' + resp)
            })
        })

        router.get('/find/:title/:region', (req, res) => {
            const t = req.params.title
            const title = t.replace(' ', '')
            const client_region = req.params.region

            this.filmBusiness.findByTitle(title).then((resp) => {
                const re = {
                    res: resp,
                    msg: 'ENCONTRADO!'
                }
                this.filmBusiness.findViewsByRegion(client_region, title)
                    .then((resp) => {
                        console.log('findViewsByRegion')
                        this.filmBusiness.addViews(client_region, title)
                            .then((resp) => {
                                console.log(title + ' foi solicitado')
                            })
                            .catch((resp) => {
                                console.log('não adicionado')
                            })
                    })
                    .catch((resp) => {
                        this.filmBusiness.addRegionInViews(client_region, title)
                            .then((resp) => {
                                console.log('addRegionInViews')
                                console.log('Nova Região Está Assistindo!')
                            })
                            .catch((resp) => {
                                console.log('Não Conseguiu Add Região!')
                            })
                    })
                res.send(re)
            }).catch((resp) => {
                res.send('NÃO ENCONTRADO!')
            })
        })

        router.get('/findAll', (req, res) => {
            this.filmBusiness.findAll().then((resp) => {
                res.send(resp)
            }).catch((resp) => {
                res.send(resp)
            })
        })

        router.get('/findByTags/:tags', (req, res) => {
            const tags = req.params.tags
            let ta = tags.replace(' ', '')
            ta = ta.split(',')
                //console.log('PARAMMM ==>>>', ta)
            this.filmBusiness.findByTags(ta).then((resp) => {
                res.send(resp)
            }).catch((resp) => {
                res.send(resp)
            })
        })

        router.get('/streaming/getLegenda/:pasta/:legenda', (req, res) => {
            const legendaFile = 'movies/' + req.params.pasta + '/' + req.params.legenda
            console.log('CHEGOUU ISSOOO =>', legendaFile)
            fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
        })

        router.get('/streaming/play/:pasta/:film', (req, res) => {
            const movieFile = 'movies/' + req.params.pasta + '/' + req.params.film
            console.log('STREAMING => ', movieFile)
            fs.stat(movieFile, (err, stats) => {
                if (err) {
                    console.log(err);
                    return res.status(404).end('<h1>Movie Not found</h1>')
                }
                // Variáveis necessárias para montar o chunk header corretamente
                const { range } = req.headers
                const { size } = stats
                const start = Number((range || '').replace(/bytes=/, '').split('-')[0])
                const end = size - 1
                const chunkSize = (end - start) + 1
                    // Definindo headers de chunk
                res.set({
                    'Content-Range': `bytes ${start}-${end}/${size}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                });

                //console.log(start)
                // É importante usar status 206 - Partial Content para o streaming funcionar
                res.status(206)
                    // Utilizando ReadStream do Node.js
                    // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()

                const stream = fs.createReadStream(movieFile, { start, end })
                stream.on('open', () => stream.pipe(res));
                stream.on('error', (streamErr) => res.end(streamErr))
            })
        })

    }

}

module.exports = FilmRouter