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

export const getFilmsByUser = async (id) => {
    const query = db('films').select('*').where('userId', id)

    const films = await query

    return films
}

export const createFilm = async (data) => {
    await db('films').insert(data)
}

export const getNextFilmId = async () => {
    const films = await getAllFilms()
    let ids = Array()
    for (const film of films) {
        ids.push(Number(film.id))
    }
    let nextId
    if (ids.length < 1) {
        nextId = 1
    } else {
        nextId = Math.max.apply(Math, ids) + 1
    }
    return nextId
}