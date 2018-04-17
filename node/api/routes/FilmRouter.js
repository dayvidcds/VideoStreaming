const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const router = express.Router()
const path = require('path')
const request = require('request')

const config = require('../configs/server.json')

const publicDir = path.join(__dirname, '../../public/')

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
                title: req.body.title
            }
            this.filmBusiness.insert(film).then((resp) => {

                const DNS = config.dnsaddress

                const hostname = config.blchostname

                const headers = {
                    'User-Agent': 'Super Agent/0.0.1',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

                const options = {
                    url: DNS + '/dns/findByAddress/' + hostname,
                    method: 'GET',
                    headers: headers
                }


                /* 
                    Envia o objeto do filme para o balanceador 
                    notificar os demais nós sobre a modificacao,
                    para que eles baixem o filme
                */                
                request(options, function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        const headersInsert = {
                            'User-Agent': 'Super Agent/0.0.1',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }

                        const ipBusca = JSON.parse(body)
                        const myHostname = config.myhostname

                        console.log('BOODYY  ', ipBusca.ipaddr)

                        /* 
                        const optionsInsert = {
                            url: 'http://' + ipBusca.ipaddr + '/node/insertMovie',
                            method: 'POST',
                            headers: headersInsert,
                            form: { address: myHostname, tags: film.tags }
                        }
                        */

                        const optionsInsert = {
                            url: 'http://' + ipBusca.ipaddr + '/node/insertMovie',
                            method: 'POST',
                            headers: headersInsert,
                            form: { address: myHostname, film: film }
                        }

                        request(optionsInsert, function(error, response, body) {
                            console.log('RESPOSTA => ', body)
                        })

                    }
                })

                res.send('<h2>INSERIDO!</h2><br><br>' + resp)
            }).catch((resp) => {
                res.send('ERRO => ' + resp)
            })
        })

        router.get('/find/:title', (req, res) => {
            const t = req.params.title
            const title = t.replace(' ', '')
            this.filmBusiness.findByTitle(title).then((resp) => {
                const re = {
                    res: resp,
                    msg: 'ENCONTRADO!'
                }
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
            console.log('PARAMMM ==>>>', ta)
            this.filmBusiness.findByTags(ta).then((resp) => {
                res.send(resp)
            }).catch((resp) => {
                res.send(resp)
            })
        })

        /*router.get('/streaming', (req, res) => {
            fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
        })*/

        router.get('/streaming/play/:local', (req, res) => {
            const movieFile = 'movies/' + req.params.local
            console.log(movieFile)
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