const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()

const publicDir = path.join(__dirname, './public/')
const legenda = path.join(__dirname, './public/legenda/')

app.use('/legenda/', express.static(legenda))

/*app.use('/legenda/:title', (req, res) => {
    console.log('TITULLOOOO ==> ', req.params.title)
    fs.readFile(legenda + req.params.title + '.vtt', (err, html) => res.end(html))
})*/

app.use('/', (req, res) => {
    fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
        // res.sendFile(publicDir + 'index.html')
        //res.send('VideoFlix Server!')
    console.log('Novo cliente')
})

app.listen(2000, () => console.log('VideoFlix Server!: port: 2000'))