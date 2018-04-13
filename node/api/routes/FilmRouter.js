const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const router = express.Router()
const path = require('path')

const publicDir = path.join(__dirname, '../../public/')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

class FilmRouter {
    constructor(filmBusiness) {
        this.filmBusiness = filmBusiness
        this.initializeRoutes()
        this.router = router
        this.local = null
    }

    initializeRoutes() {

        router.post('/insert', (req, res) => {
            const film = {
                route_video: req.body.route_video,
                tags: req.body.tags,
                title: req.body.title
            }
            this.filmBusiness.insert(film).then((resp) => {
                res.send('<h2>INSERIDO!</h2><br><br>' + resp)
            }).catch((resp) => {
                res.send('ERRO => ' + resp)
            })
        })

        router.get('/find/:title', (req, res) => {
            const title = req.params.title
            console.log(title)
            this.filmBusiness.findByTitle(title).then((resp) => {
                this.local = resp.route_video
                console.log('LOCAL: ', this.local)
                    //fs.readFile(publicDir + './index.html', (err, html) => res.end(html));
                res.redirect('/streaming')
            }).catch((resp) => {
                res.send('NÃO ENCONTRADO!')
            })
        })

        router.get('/streaming', (req, res) => {
            fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
        })

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