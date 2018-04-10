class BalancerBusiness {
    constructor(balancerRepository) {
        this.repository = balancerRepository
    }

    insert(balancerP) { // address, country_code, country_name, region_code, region_name, city
        return new Promise((resolve, reject) => {
            console.log(balancerP.address)
            this.repository.findByAddress(balancerP.address).catch((error) => {
                console.log('entrou')
                const balancer = {
                    address: balancerP.address,
                    country_code: balancerP.country_code,
                    country_name: balancerP.country_name,
                    region_code: balancerP.region_code,
                    region_name: balancerP.region_name,
                    city: balancerP.city
                }
                this.repository.insert(balancer)
                    .then((resp) => {
                        resolve(resp)
                    })
                    .catch((resp) => {
                        reject(resp)
                    })
            }).then((resp) => {
                reject(resp)
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

    matchToken(token, callback) {
        if (token == TOKEN) {
            callback(true)
        }
        callback(false)
    }

}

module.exports = BalancerBusiness