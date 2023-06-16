import express from "express";
import {
    createFilm,
    getNextFilmId,
} from "../db/films.js";
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

export default films