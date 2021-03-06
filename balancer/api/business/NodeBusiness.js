class nodeBusiness {
    constructor(nodeRepository) {
        this.repository = nodeRepository
    }

    insertFilms(node){

        console.log('FILMES A SEREM ADICIONADOS', node)

        return new Promise((resolve, reject) => {
            this.repository.findByAddress(node.address)
                .then(dados =>{
                    this.repository.insertFilms(node)
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

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByTags(tags)
                .then(res =>{
                    resolve(res)
                }).catch(err => {
                    reject(err)
            })
        })
    }

    insert(node) { // address, country_code, country_name, region_code, region_name, city
        return new Promise((resolve, reject) => {

            console.log('addddr' , node)

            this.repository.findByAddress(node.address)
                .then((resp) => {
                    reject(resp)
                }).catch((error) => {

                console.log('nao exxxxiiste')

                this.repository.insert(node)
                    .then((resp) => {
                        resolve(resp)
                    })
                    .catch((resp) => {

                        console.log('nodezzz', node)

                        reject(resp)
                    })
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