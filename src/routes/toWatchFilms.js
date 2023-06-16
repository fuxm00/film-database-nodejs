import {addToWatchFilm, getToWatchByUser, removeToWatchFilm} from "../db/toWatch.js";
import {getWatchedByUser} from "../db/watched.js";
import {getFavouriteByIdAndUser} from "../db/favourites.js";
import {getFilmById} from "../db/films.js";
import films from "./films.js";
import express from "express";
import auth from "../middlewares/auth.js";

const toWatchFilms = express.Router()

films.get('/to-watch', auth, async (req, res) => {
    const user = res.locals.user

    const toWatchFilms = await getToWatchByUser(user.id)
    const watchedFilms = await getWatchedByUser(user.id)

    for (const film of watchedFilms) {
        const favouriteFilm = await getFavouriteByIdAndUser(user.id, film.id)
        film.favourite = !!favouriteFilm;
    }

    console.log(watchedFilms)

    res.render('toWatch', {
        title: 'Ke zhlédnutí',
        toWatchFilms,
        watchedFilms,
        marked: 'toWatch'
    })
})

films.get('/add-to-watch/:id', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)
    if (!film) return next()

    const user = res.locals.user

    await addToWatchFilm(user.id, filmId)

    res.redirect('back')
})

films.get('/remove-from-to-watch/:id', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)
    if (!film) return next()

    const user = res.locals.user

    const toWatch = await getToWatchByUser(user.id)

    if (!toWatch) return next()

    await removeToWatchFilm(user.id, filmId)

    res.redirect('back')
})

export default toWatchFilms