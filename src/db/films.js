import db from '../db.js'

export const getAllFilms = async () => {
    const query = db('films').select('*')

    const films = await query

    return films
}

export const getFilmById = async (id) => {
    const film = await db('films').select('*').where('id', id).first()

    return film
}

export const getFilmsByUser = async (id) => {
    const query = db('films').select('*').where('userId', id)

    const films = await query

    return films
}

export const createFilm = async (data) => {
    await db('films').insert(data)
}