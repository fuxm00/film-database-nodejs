import db from "../db.js";
import {currentDate} from "../utils/date.js";

export const increaseFilmWatchCounterByIdAndUser = async (userId, filmId) => {

    let count = await getCounterByIdAndUser(userId, filmId)

    if (count >= 1) {
        count++
        await db('watched').update({count: count, last_seen: currentDate()})
            .where(function () {
                this
                    .where('userId', userId)
                    .andWhere('filmId', filmId)
            })
    } else {
        await db('watched').insert({userId: userId, filmId: filmId, count: 1, last_seen: currentDate()})
    }
}

export const getCounterByIdAndUser = async (userId, filmId) => {
    const film = await db('watched').select('*').where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    }).first()

    return film ? Number(film.count) : 0

}

export const getWatchedByUser = async (id) => {
    const query = db('films').select('*')
        .where(function () {
            this
                .whereNotNull('watched.count')
                .andWhere('watched.userId', id)
        })
        .leftJoin('watched', 'films.id', 'watched.filmId')
        .leftJoin(
            db('rating')
                .select('*')
                .where('userId', id)
                .as('rating'),
            'films.id',
            'rating.filmId'
        )

    const watched = await query

    return watched
}

export const getWatchedByUserAndFilm = async (userId, filmId) => {
    const query = db('films').select('*')
        .where(function () {
            this
                .whereNotNull('watched.count')
                .andWhere('watched.userId', userId)
                .andWhere('films.id', filmId)
        })
        .leftJoin('watched', 'films.id', 'watched.filmId')
        .leftJoin('rating', 'films.id', 'rating.filmId')
        .first()

    const toWatch = await query

    return toWatch
}

