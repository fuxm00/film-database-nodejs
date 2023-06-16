import express from 'express'
import films from './routes/films.js'
import users from "./routes/users.js";
import cookieParser from 'cookie-parser'
import loadUser from './middlewares/loadUser.js'
import {getAllFilms} from "./db/films.js";
import {getFavouriteByIdAndUser, getFavouritesByFilm} from "./db/favourites.js";
import {getToWatchByIdAndUser} from "./db/toWatch.js";
import watchedFilms from "./routes/watchedFilms.js";
import toWatchFilms from "./routes/toWatchFilms.js";
import favFilms from "./routes/favFilms.js";
import {getWatchedByUserAndFilm} from "./db/watched.js";

export const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(loadUser)

app.get('/', async (req, res) => {

    const user = res.locals.user
    const films = await getAllFilms()
    const filmsToShow =  films.slice(-8)
    filmsToShow.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));

    if (user) {
        for (const film of filmsToShow) {
            const favouriteFilm = await getFavouriteByIdAndUser(user.id, film.id)
            film.favourite = !!favouriteFilm;

            const toWatchFilm = await getToWatchByIdAndUser(user.id, film.id)
            film.toWatch = !!toWatchFilm;

            const watchedFilm = await getWatchedByUserAndFilm(user.id, film.id)
            film.watched = !!watchedFilm;

            const favouriteFilms = await getFavouritesByFilm(film.id)
            film.favCount = favouriteFilms.length;
        }
    }

    res.render('films', {
        title: 'Films',
        films: filmsToShow,
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