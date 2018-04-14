const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const DNSRepository = require('./api/model/DNSRepository');
const DNSBusiness = require('./api/business/DNSBusiness');
const DNSRouter = require('./api/routes/DNSRouter');

const dnsRep = new DNSRepository();
const dnsBus = new DNSBusiness(dnsRep, io);
const dnsRouter = new DNSRouter(dnsBus);

app.use('/dns', dnsRouter.router)

app.use('/', (req, res) => {
    res.status(200).json(
        {
            status: 'working',
            name: 'DNS'
        }
    )
})

module.exports = server