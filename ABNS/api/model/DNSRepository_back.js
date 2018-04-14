
class DNSRepository {

    constructor() {
        this.table = []
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
            this.table.push(server)
            resolve(server)
        })
    }

    getIPAddrByHostname(hostname){
        return new Promise((resolve, reject) => {
            this.table.forEach((server)=>{
                if(
                    server.hostname === hostname
                    && server.ipaddr != undefined
                    && server.ipaddr != ''
                ) {
                    resolve(server.ipaddr)
                    return
                }
            })
            reject('SERVIDOR NAO ENCONTRADO')
        })
    }

    remove(hostname){
        return new Promise((resolve, reject) => {
            this.table.forEach(server => {
                if(server.hostname === hostname) {
                    table.splice(i, 1)
                    resolve(server)
                    return
                }
            })
            reject('ERRO. HOSTNAME NAO ENCONTRADO NA TABELA')
        })
    }
    
    getTable(){
        return this.table
    }
    
}

module.exports = DNSRepository