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
    const user = res.locals.user

    if (!user) {
        res.render('login', {
            title: 'Přihlášení',
        })
        return
    }

    const title = String(req.body.title)
    const year = String(req.body.year)

    if (!user) {
        res.redirect('/')
    }

    const userId = user.id

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

films.get('/remove-favourite/:id', async (req, res, next) => {
    const filmId = Number(req.params.id)
    const userId = res.locals.user.id

    const favourite = await getFavouriteByIdAndUser(userId, filmId)

    if (!favourite) return next()

    await removeFavouriteFilm(userId, filmId)

    res.redirect('back')
})

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