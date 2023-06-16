import db from '../db.js'

export const getFavouritesByUser = async (id) => {
    const query = db('favourites').select('*').where('favourites.userId', id).leftJoin('films', 'favourites.filmId', 'films.id')

    const favourites = await query

    return favourites
}

export const getFavouriteByIdAndUser = async (userId, filmId) => {
    const film = await db('favourites').select('*').where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    }).first()

    return film
}

export const getFavouritesByFilm = async (filmId) => {
    const favourites = await db('favourites').select('*')
        .where('filmId', filmId)

    return favourites
}

export const addFavouritesFilm = async (userId, filmId) => {
    await db('favourites').insert({userId, filmId})
}

export const removeFavouriteFilm = async (userId, filmId) => {
    await db('favourites').delete().where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    })
}