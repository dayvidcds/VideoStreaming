var io = require('socket.io-client')

var myHostname = 'no02.com'
var myIPaddr = '1.1.1.2'

var socket = io('http://localhost:4000');
  socket.on('connect', function () {
	console.log( myHostname + '|' +  myIPaddr +' connected to server')
	socket.on('discover', function (msg) {
      console.log('new message from server > ' , msg )
	  if(msg.discover === myHostname){
		socket.emit('discovered', {hostname: myHostname, ipaddr: myIPaddr})
	}
	  
	  //socket.emit('client response')
    });
  });
