class FilmBusiness {

    constructor(filmRepository) {
        this.repository = filmRepository
    }

    insert(film) {
        return new Promise((resolve, reject) => {
            this.repository.insert(film)
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.repository.findAll()
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findByTags(tags) {
        return new Promise((resolve, reject) => {
            this.repository.findByTags(tags)
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findByTitle(title) {
        return new Promise((resolve, reject) => {
            this.repository.findByName(title)
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findTags() {
        return new Promise((resolve, reject) => {
            this.repository.findTags()
                .then((resp) => {
                    resolve(resp._tags)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    addViews(region, film) {
        return new Promise((resolve, reject) => {
            this.repository.addViews(region, film)
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findViewsByRegion(region, filmTitle) {
        return new Promise((resolve, reject) => {
            this.repository.findViewsByRegion(region, filmTitle)
                .then((resp) => {
                    //console.log('RESSSSSSSSSS '  + resp)
                    resolve(resp)
                }).catch((resp) => {
                    //console.log('eeeeeeeeeerrr' + resp)
                    reject(resp)
                })
        })
    }

    addRegionInViews(region, filmTitle) {
        return new Promise((resolve, reject) => {
            this.repository.addRegionInViews(region, filmTitle)
                .then((resp) => {
                    resolve(resp)
                }).catch((resp) => {
                    reject(resp)
                })
        })
    }

    findFilmsReduce() {
        return new Promise((resolve, reject) => {
            this.repository.findFilmsReduce().then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

}

module.exports = FilmBusiness