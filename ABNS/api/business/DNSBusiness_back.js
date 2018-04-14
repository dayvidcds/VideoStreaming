const http = require('http');
const io = require('socket.io');
//const EventEmmiter = require('events')
//class ConnectionEventEmitter extends EventEmmiter{};

class DNSBusiness{

    constructor (dnsRepository) {
        this.dnsRepository = dnsRepository//new require('../model/DNSRepository')
        this.app = http.createServer((req, res)=>{
            res.writeHead(200);
            res.end(JSON.stringify({status: 'connected'}));
        })
        this.server = io(this.app)
        this.startServer()
        //this.eventEmmiter = new ConnectionEventEmitter()
    }

    /*Adiciona um novo servidor na tabela de servidores do DNS*/
    addServer(server){
        this.dnsRepository.insert(server).then(
            res=>{console.log('servers ' + res + ' saved on table')}
        ).catch(err => {
            console.log(err)
        })
    }

    /*Procura um servidor pelo hostname na tabela do dns
    * Caso nao encontre, envia uma mensagem em broadcast
    *quem possuir o nome do host, vai devolver o endereco ip respectivo
    * */
    findServerByHostname(hostname){
        return new Promise((resolve, reject) => {
            this.dnsRepository.getIPAddrByHostname(hostname)
                .then(
                    ipaddr=>{
                        console.log(ipaddr)
                    }
                ).catch(
                    err => {
                        console.log(err + ' Buscando por um correspondente na rede...')
                        const message = {discover: hostname}
                        this.sendBroadcastMessage(message)
                        let attempNumber = 0
                        const attempInterval = setInterval(()=>{
                            this.dnsRepository.getIPAddrByHostname(hostname).then(ipaddr =>{
                                console.log('Encontrado! ' + ipaddr)
                                resolve(ipaddr)
                                clearInterval(attempInterval)
                            }).catch(err => {
                                console.log('tentativa ' + attempNumber++)
                            })
                            if (attempNumber >= 3) {
                                reject('NENHUM SERVIDOR CORRESPONDENTE ENCONTRADO')
                                clearInterval(attempInterval)
                            }
                        }, 1000)
                    }
                )
        })
    }

    sendBroadcastMessage(message){
        this.server.emit('discover', message)
    }

    startServer(){
        this.server.on('connection', socket =>{
            console.log('new connection oppened')

//            socket.emit('message', { hello: 'world' });

            /*Quando o cliente responder com seu enredeco de ip*/
            socket.on('discovered', server=> {
                this.addServer(server)
                //this.eventEmmiter.emit('discovered', message)
                //console.log(data);
                //socket.broadcast.emit('message', {message: data + 'replication message sent to all clients over broadcast'});
            });
        });

        this.app.listen(4000, ()=>{
            console.log('DNS iniciado')
        })
    }
}

module.exports = DNSBusiness