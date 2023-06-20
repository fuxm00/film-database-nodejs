import db from '../db.js'

export const getAllFilms = async (limit) => {
    let query = db('films').select('*')

    if (limit) {
        query.limit(limit)
    }

    const films = await query

    return films
}

export const getFilmById = async (id) => {
    const film = await db('films').select('*').where('id', id).first()

    return film
}

export const createFilm = async (data) => {
    await db('films').insert(data)
}