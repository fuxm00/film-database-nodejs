import {getFilmById} from "../db/films.js";
import {increaseFilmWatchCounterByIdAndUser} from "../db/Watched.js";
import {setRatingByUserAndFilm} from "../db/rating.js";
import films from "./films.js";
import express from "express";

const watchedFilms = express.Router()

films.get('/watched/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)

    const film = await getFilmById(filmId)

    if (!film) return next()

    const userId = res.locals.user.id

    await increaseFilmWatchCounterByIdAndUser(userId, filmId)

    res.redirect('back')
})

films.get('/rated/:id/:rating', async (req, res, next) => {
    const filmId = Number(req.params.id)
    const rating = Number(req.params.rating)

    const film = await getFilmById(filmId)

    if (!film) return next()

    const userId = res.locals.user.id

    await setRatingByUserAndFilm(userId, filmId, rating)

    res.redirect('back')
})

export default watchedFilms