class FilmBusiness {

    constructor(filmRepository) {
        this.repository = filmRepository
    }

    insert(film) {
        return new Promise((resolve, reject) => {
            this.repository.insert(film).then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.repository.findAll().then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

    findByTitle(title) {
        return new Promise((resolve, reject) => {
            this.repository.findByName(title).then((resp) => {
                resolve(resp)
            }).catch((resp) => {
                reject(resp)
            })
        })
    }

}

module.exports = FilmBusiness