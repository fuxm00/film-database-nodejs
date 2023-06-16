import express from "express";
import {
    createFilm,
    getNextFilmId,
} from "../db/films.js";
import multer from "multer";
import * as path from "path";
import auth from "../middlewares/auth.js";

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

films.post('/add', auth ,upload.single('image'), async (req, res) => {


    const title = String(req.body.title)
    const year = String(req.body.year)

    const userId = res.locals.user.id

    await createFilm(
        {title, year, userId},
    )

    res.redirect('back')
})

export default films