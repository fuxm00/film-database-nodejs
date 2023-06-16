import express from 'express'
import films from './routes/films.js'
import users from "./routes/users.js";
import cookieParser from 'cookie-parser'
import loadUser from './middlewares/loadUser.js'
import {getAllFilms} from "./db/films.js";
import {getFavouriteByIdAndUser} from "./db/favourites.js";
import {getToWatchByIdAndUser} from "./db/toWatch.js";
import watchedFilms from "./routes/watchedFilms.js";
import toWatchFilms from "./routes/toWatchFilms.js";
import favFilms from "./routes/favFilms.js";
import {getWatchedByUserAndFilm} from "./db/Watched.js";

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(loadUser)

app.get('/', async (req, res) => {

    const user = res.locals.user
    const films = await getAllFilms()

    if (user) {
        for (const film of films) {
            const favouriteFilm = await getFavouriteByIdAndUser(user.id, film.id)
            const toWatchFilm = await getToWatchByIdAndUser(user.id, film.id)
            const watchedFilm = await getWatchedByUserAndFilm(user.id, film.id)

            film.favourite = !!favouriteFilm;
            film.toWatch = !!toWatchFilm;
            film.watched = !!watchedFilm;
        }
    }

    console.log(films)

    res.render('films', {
        title: 'Films',
        films,
        marked: 'films'
    })


})

app.use(films)
app.use(favFilms)
app.use(toWatchFilms)
app.use(watchedFilms)
app.use(users)

app.use((req, res) => {
    console.log('404', req.method, req.url)

    res.render('404', {
        title: '404 - Stránka nenalezena'
    })
})