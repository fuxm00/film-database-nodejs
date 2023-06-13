import db from "../db.js";

export const increaseFilmWatchCounterByIdAndUser = async (userId, filmId) => {

    let count = await getCounterByIdAndUser(userId, filmId)

    if (count >= 1) {
        count++
        await db('watched').update({count})
            .where(function () {
                this
                    .where('userId', userId)
                    .andWhere('filmId', filmId)
            })
    } else {
        await db('watched').insert({userId: userId, filmId: filmId, count: 1})
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

    const toWatch = await query

    return toWatch
}

