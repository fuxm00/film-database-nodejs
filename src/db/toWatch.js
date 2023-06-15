import db from '../db.js'
import {getCounterByIdAndUser} from "./Watched.js";

export const getToWatchByUser = async (id) => {
    const query = db('toWatch')
        .select('toWatch.userId', 'films.title', 'films.year', 'films.id')
        .where(function () {
            this
                .where('toWatch.userId', id)
        })
        .join('films', 'toWatch.filmId', 'films.id')

    const toWatch = await query

    let notSeenToWatch = Array()

    for (const film of toWatch) {
        if (!await getCounterByIdAndUser(id, film.id)) {
            notSeenToWatch.push(film)
        }
    }

    return notSeenToWatch
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