
class DNSRepository {

    constructor() {
        this.table = {}
    }

    /*host é um objeto do tipo: {hostname: '', ipaddr: ''}*/
    insert(server) {
        return new Promise((resolve, reject) => {
            if(
                server == null
                || server.hostname == undefined
                || server.hostname == ''
                || server.ipaddr == undefined
                || server.ipaddr == ''
            ) {
                reject('FORMATO DO OBJETO INCORRETO - MODELO: {hostname: \'\', ipaddr: \'\'}')
                return
            }
            this.table[server.hostname] = server.ipaddr
            resolve(server)
        })
    }

    getIPAddrByHostname(hostname){
        return new Promise((resolve, reject) => {
            const server = this.table[hostname]
            if(server != undefined && server != ''){
                resolve(server)
                return
            }
            reject('SERVIDOR NAO ENCONTRADO')
        })
    }

    remove(hostname){
        delete this.table[hostname]
    }
    
    getTable(){
        return this.table
    }
    
}

module.exports = DNSRepository