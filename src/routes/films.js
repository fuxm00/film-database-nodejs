import express from "express";
import {
    createFilm,
    getFilmById, getNextFilmId,
} from "../db/films.js";
import {
    addFavouritesFilm,
    getFavouritesByUser,
    removeFavouriteFilm,
    getFavouriteByIdAndUser
} from "../db/favourites.js";
import {
    addToWatchFilm,
    getToWatchByUser,
    removeToWatchFilm
} from "../db/toWatch.js";
import {getWatchedByUser, increaseFilmWatchCounterByIdAndUser} from "../db/Watched.js";
import {setRatingByUserAndFilm} from "../db/rating.js";
import multer from "multer";
import * as path from "path";

const films = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/film_covers')
    },
    filename: async function (req, file, cb) {
        const extension = path.extname(file.originalname)
        cb(null, await getNextFilmId() + extension)
    }
})

const upload = multer({storage: storage})

films.post('/add', upload.single('image'), async (req, res) => {
    const title = String(req.body.title)
    const year = String(req.body.year)
    const userId = res.locals.user.id

    if (!userId) {
        res.redirect('/')
    }

    await createFilm(
        {title, year, userId},
    )

    res.redirect('back')
})

films.get('/favourites/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)

    const film = await getFilmById(filmId)

    if (!film) return next()

    const userId = res.locals.user.id

    await addFavouritesFilm(userId, filmId)

    res.redirect('back')
})

films.get('/favourites', async (req, res) => {
    const films = await getFavouritesByUser(res.locals.user.id)

    res.render('favourites', {
        title: 'Favourites',
        films,
    })
})

films.get('/remove-favourite/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)
    const userId = res.locals.user.id

    const favourite = await getFavouriteByIdAndUser(userId, filmId)

    if (!favourite) return next()

    await removeFavouriteFilm(userId, filmId)

    res.redirect('back')
})

films.get('/to-watch', async (req, res) => {
    const toWatchFilms = await getToWatchByUser(res.locals.user.id)
    const watchedFilms = await getWatchedByUser(res.locals.user.id)

    const user = res.locals.user

    for (const film of watchedFilms) {
        const favouriteFilm = await getFavouriteByIdAndUser(user.id, film.id)
        film.favourite = !!favouriteFilm;
    }

    res.render('toWatch', {
        title: 'Ke zhlédnutí',
        toWatchFilms,
        watchedFilms
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

    const toWatch = await getToWatchByUser(userId, filmId)

    if (!toWatch) return next()

    await removeToWatchFilm(userId, filmId)

    res.redirect('back')
})

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


export default films