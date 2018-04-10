class BalancerBusiness {
    constructor(balancerRepository) {
        this.repository = balancerRepository
    }

    insert(balancer) { // address, country_code, country_name, region_code, region_name, city
        return new Promise((resolve, reject) => {
            this.repository.findByAddress(address)
                .catch((error) => {
                    /*const balancer = {
                        address: address,
                        country_code: country_code,
                        country_name: country_name,
                        region_code: region_code,
                        region_name: region_name,
                        city: city
                    }*/
                    this.repository.insert(balancer)
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