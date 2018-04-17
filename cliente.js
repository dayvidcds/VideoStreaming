var io = require('socket.io-client')

var myHostname = 'no02.com'
var myIPaddr = '1.1.1.2'

app.use(function(req, res, next) {
    // console.log(req.connection.remoteAddress)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

var socket = io('http://localhost:4000');
socket.on('connect', function() {
    console.log(myHostname + '|' + myIPaddr + ' connected to server')
    socket.on('discover', function(msg) {
        console.log('new message from server > ', msg)
        if (msg.discover === myHostname) {
            socket.emit('discovered', { hostname: myHostname, ipaddr: myIPaddr })
        }

        //socket.emit('client response')
    });
});