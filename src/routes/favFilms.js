import {
    addFavouritesFilm,
    getFavouriteByIdAndUser,
    getFavouritesByUser,
    removeFavouriteFilm
} from "../db/favourites.js";
import films from "./films.js";
import {getFilmById} from "../db/films.js";
import express from "express";

const favFilms = express.Router()

films.get('/favourites', async (req, res) => {

    const user = res.locals.user

    if (!user) {
        res.render('login', {
            title: 'Přihlášení',
        })
        return
    }

    const films = await getFavouritesByUser(user.id)

    res.render('favourites', {
        title: 'Favourites',
        films,
        marked: 'favourites'
    })
})

films.get('/favourites/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)

    const film = await getFilmById(filmId)

    if (!film) return next()

    const userId = res.locals.user.id

    await addFavouritesFilm(userId, filmId)

    res.redirect('back')
})

films.get('/remove-favourite/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)
    const userId = res.locals.user.id

    const favourite = await getFavouriteByIdAndUser(userId, filmId)

    if (!favourite) return next()

    await removeFavouriteFilm(userId, filmId)

    res.redirect('back')
})

export default favFilms