import express from "express";
import {
    createFilm, getFilmById,
    getNextFilmId,
} from "../db/films.js";
import multer from "multer";
import * as path from "path";
import auth from "../middlewares/auth.js";
import {createComment, getCommentsByFilm} from "../db/comments.js";
import {loadFilmDetails} from "../utils/loadFilmDetails.js";
import {getAvgRatingByFilm} from "../db/rating.js";

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

films.post('/add', auth, upload.single('image'), async (req, res) => {


    const title = String(req.body.title)
    const year = String(req.body.year)

    const userId = res.locals.user.id

    await createFilm(
        {title, year, userId},
    )

    res.redirect('back')
})

films.get('/film/:id', async (req, res, next) => {

    const filmId = req.params.id

    if (!filmId) return next()

    const film = await getFilmById(filmId)

    const user = res.locals.user

    if (user) {
        await loadFilmDetails(user.id, film)
    } else {
        film.avgRating = await getAvgRatingByFilm(film.id);
    }

    const comments = await getCommentsByFilm(film.id, 5)

    res.render('film', {
        title: film.title,
        film,
        marked: 'none',
        user,
        comments
    })
})

films.post('/add-comment/:id', auth, async (req, res, next) => {
    const filmId = req.params.id

    if (!filmId) return next()

    const text = String(req.body.text)

    const userId = res.locals.user.id

    await createComment(userId, filmId, text)

    res.redirect('back')
})

export default films