/*const http = require('http');
const io = require('socket.io');*/
//const EventEmmiter = require('events')
//class ConnectionEventEmitter extends EventEmmiter{};

class DNSBusiness{

    constructor (dnsRepository, server) {
        this.dnsRepository = dnsRepository//new require('../model/DNSRepository')
        //this.server = io(this.app)
        this.server = server
        this.startServer()
        //this.eventEmmiter = new ConnectionEventEmitter()
    }

    /*Adiciona um novo servidor na tabela de servidores do DNS*/
    addServer(server){
        this.dnsRepository.insert(server).then(
            res=>{console.log('SERVIDOR ' + JSON.stringify(res) + ' SALVO NA TABELA')}
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
                        console.log('ENCONTRADO NA TABELA: ' + ipaddr)
                        resolve(ipaddr)
                        return
                    }
                ).catch(
                    err => {
                        console.log(err + ' BUSCANDO POR UM CORRESPONDENTE NA REDE')
                        const message = {discover: hostname}
                        this.sendBroadcastMessage(message)
                        let attempNumber = 0
                        const attempInterval = setInterval(()=>{
                            this.dnsRepository.getIPAddrByHostname(hostname).then(ipaddr =>{
                                console.log('ENCONTRADO NA REDE: ' + ipaddr)
                                resolve(ipaddr)
                                clearInterval(attempInterval)
                            }).catch(err => {
                                console.log('TENTATIVA ' + attempNumber++)
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
            console.log('nova conexao aberta')

//            socket.emit('message', { hello: 'world' });

            /*Quando o cliente responder com seu enredeco de ip*/
            socket.on('discovered', server=> {
                this.addServer(server)
                //this.eventEmmiter.emit('discovered', message)
                //console.log(data);
                //socket.broadcast.emit('message', {message: data + 'replication message sent to all clients over broadcast'});
            });
        });
    }
}

module.exports = DNSBusiness