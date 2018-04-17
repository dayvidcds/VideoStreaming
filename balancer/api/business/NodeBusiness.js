class nodeBusiness {
    constructor(nodeRepository, socket) {
        this.repository = nodeRepository
        this.broadcastSocket = socket
    }

     /* {film, address} */
    notifyChanges(nodeChangeInfo){
        this.broadcastSocket.emit('changes', nodeChangeInfo)
    }

    updateTags(address, tags){
        console.log('busss', address, tags)
        return new Promise((resolve, reject) => {
            this.repository.findByAddress(address)
                .then(dados =>{
                    this.repository.updateTags(address, tags)
                        .then(resp =>{
                            resolve(resp)
                        }).catch(err=>{
                           reject(err)
                        })
                })
                .catch(err=>{
                    reject(err)
                })

        })
    }

    insert(node) { // address, country_code, country_name, region_code, region_name, city
        return new Promise((resolve, reject) => {
            this.repository.findByAddress(node.address)
                .catch((error) => {
                    this.repository.insert(node)
                        .then((resp) => {
                            resolve(resp)
                        })
                        .catch((resp) => {
                            reject(resp)
                        })
                })
                .then((resp) => {
                    reject(resp)
                })
        })
    }

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByTags(tags).then(res=>{
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    findByAddress(address) {
        return new Promise((resolve, reject) => {
            this.repository.findByAddress(address)
                .then((resp) => {
                    resolve(resp)
                })
                .catch((resp) => {
                    reject(resp)
                })
        })

    }

    findByCountry(country) {
        return new Promise((resolve, reject) => {
            this.repository.findByCountry(country)
                .then((resp) => {
                    resolve(resp)
                })
                .catch((resp) => {
                    reject(resp)
                })
        })

    }

    findByContent(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByContent(tags)
                .then((resp) => {
                    resolve(resp)
                })
                .catch((resp) => {
                    reject(resp)
                })
        })
    }

    remove(address) {
        return new Promise((resolve, reject) => {
            this.repository.remove(address)
                .then((resp) => {
                    resolve(resp)
                })
                .catch((resp) => {
                    reject(resp)
                })
        })
    }

}

module.exports = nodeBusiness