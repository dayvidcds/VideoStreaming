const fs = require('fs')
const express = require('express')
const path = require('path')
const app = express()

const publicDir = path.join(__dirname, './public/')

app.get('/streaming', (req, res) => {
    fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
})

app.use('/', (req, res) => {
    fs.readFile(publicDir + './index.html', (err, html) => res.end(html))
        // res.sendFile(publicDir + 'index.html')
        //res.send('VideoFlix Server!')
})

app.listen(2000, () => console.log('VideoFlix Server!'))