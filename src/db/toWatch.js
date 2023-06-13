import db from '../db.js'

export const getToWatchByUser = async (id) => {
    const query = db('toWatch').select('*')
        .where(function () {
            this
                .whereNull('watched.count')
                .andWhere('toWatch.userId', id)
        })
        .leftJoin('films', 'toWatch.filmId', 'films.id')
        .leftJoin('watched', 'toWatch.filmId', 'watched.filmId')


    const toWatch = await query

    return toWatch
}

export const getToWatchByIdAndUser = async (userId, filmId) => {
    const film = await db('toWatch').select('*').where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    }).first()

    return film
}

export const addToWatchFilm = async (userId, filmId) => {
    await db('toWatch').insert({userId, filmId})
}

export const removeToWatchFilm = async (userId, filmId) => {
    await db('toWatch').delete().where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    })
}