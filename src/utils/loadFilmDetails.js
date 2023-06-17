import {getFavouriteByIdAndUser, getFavouritesByFilm} from "../db/favourites.js";
import {getToWatchByIdAndUser} from "../db/toWatch.js";
import {getWatchedByUserAndFilm} from "../db/watched.js";
import {getAvgRatingByFilm} from "../db/rating.js";

export const loadFilmDetails = async function (userId, film) {
    const favouriteFilm = await getFavouriteByIdAndUser(userId, film.id)
    film.favourite = !!favouriteFilm;

    const toWatchFilm = await getToWatchByIdAndUser(userId, film.id)
    film.toWatch = !!toWatchFilm;

    const watchedFilm = await getWatchedByUserAndFilm(userId, film.id)
    film.watched = !!watchedFilm;

    const favouriteFilms = await getFavouritesByFilm(film.id)
    film.favCount = favouriteFilms.length;

    film.avgRating = await getAvgRatingByFilm(film.id);
}

