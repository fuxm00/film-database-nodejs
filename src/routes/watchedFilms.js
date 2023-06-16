import {getFilmById} from "../db/films.js";
import {increaseFilmWatchCounterByIdAndUser} from "../db/Watched.js";
import {setRatingByUserAndFilm} from "../db/rating.js";
import films from "./films.js";
import express from "express";
import auth from "../middlewares/auth.js";

const watchedFilms = express.Router()

films.get('/watched/:id', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)
    if (!film) return next()

    const user = res.locals.user

    await increaseFilmWatchCounterByIdAndUser(user.id, filmId)

    res.redirect('back')
})

films.get('/rated/:id/:rating', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)
    if (!film) return next()

    const rating = Number(req.params.rating)
    if (!rating) return next()

    const user = res.locals.user

    await setRatingByUserAndFilm(user.id, filmId, rating)

    res.redirect('back')
})

export default watchedFilms