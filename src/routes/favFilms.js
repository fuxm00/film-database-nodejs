import {
    addFavouritesFilm,
    getFavouriteByIdAndUser,
    getFavouritesByUser,
    removeFavouriteFilm
} from "../db/favourites.js";
import films from "./films.js";
import {getFilmById} from "../db/films.js";
import express from "express";
import auth from "../middlewares/auth.js";
import {sendFavouriteFilmsToAll} from "../webSockets.js";

const favFilms = express.Router()

films.get('/favourites', auth, async (req, res) => {

    const user = res.locals.user

    const films = await getFavouritesByUser(user.id)

    res.render('favourites', {
        title: 'Favourites',
        films,
        marked: 'favourites'
    })
})

films.get('/favourites/:id', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)
    if (!film) return next()

    const user = res.locals.user

    await addFavouritesFilm(user.id, filmId)
    sendFavouriteFilmsToAll(user.id)

    res.redirect('back')
})

films.get('/remove-favourite/:id', auth, async (req, res, next) => {
    const filmId = Number(req.params.id)
    const film = await getFilmById(filmId)

    if (!film) return next()

    const user = res.locals.user

    const favourite = await getFavouriteByIdAndUser(user.id, filmId)

    if (!favourite) return next()

    await removeFavouriteFilm(user.id, filmId)

    sendFavouriteFilmsToAll(user.id)

    res.redirect('back')
})

export default favFilms