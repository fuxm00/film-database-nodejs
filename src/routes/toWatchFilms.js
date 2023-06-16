import {addToWatchFilm, getToWatchByUser, removeToWatchFilm} from "../db/toWatch.js";
import {getWatchedByUser} from "../db/Watched.js";
import {getFavouriteByIdAndUser} from "../db/favourites.js";
import {getFilmById} from "../db/films.js";
import films from "./films.js";
import express from "express";

const toWatchFilms = express.Router()

films.get('/to-watch', async (req, res) => {
    const user = res.locals.user

    if (!user) {
        res.render('login', {
            title: 'Přihlášení',
        })
        return
    }

    const userId = user.id

    const toWatchFilms = await getToWatchByUser(userId)
    const watchedFilms = await getWatchedByUser(userId)

    for (const film of watchedFilms) {
        const favouriteFilm = await getFavouriteByIdAndUser(userId, film.id)
        film.favourite = !!favouriteFilm;
    }

    res.render('toWatch', {
        title: 'Ke zhlédnutí',
        toWatchFilms,
        watchedFilms,
        marked: 'toWatch'
    })
})

films.get('/add-to-watch/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)

    const film = await getFilmById(filmId)

    if (!film) return next()

    const userId = res.locals.user.id

    await addToWatchFilm(userId, filmId)

    res.redirect('back')
})

films.get('/remove-from-to-watch/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)
    const userId = res.locals.user.id

    const toWatch = await getToWatchByUser(userId)

    if (!toWatch) return next()

    await removeToWatchFilm(userId, filmId)

    res.redirect('back')
})

export default toWatchFilms