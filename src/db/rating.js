import db from "../db.js";
import {sum} from "../utils/sum.js";

export const setRatingByUserAndFilm = async (userId, filmId, rating) => {

    const newRating = rating
    const previousRating = await getRatingByUserAndFilm(userId, filmId)

    if (previousRating) {
        await db('rating').update({rating: newRating})
            .where(function () {
                this
                    .where('userId', userId)
                    .andWhere('filmId', filmId)
            })
    } else {
        await db('rating').insert({userId: userId, filmId: filmId, rating: newRating})
    }
}

export const getRatingByUserAndFilm = async (userId, filmId) => {
    const record = await db('rating').select('*').where(function () {
        this
            .where('userId', userId)
            .andWhere('filmId', filmId)
    }).first()

    return record ? Number(record.rating) : 0

}

export const getAvgRatingByFilm = async (filmId) => {

    const query = await db('rating').select('rating')
        .where('filmId', filmId)

    const ratings = await query

    if (ratings.length === 0) {
        return undefined
    } else if (ratings.length === 1) {
        return Number(ratings[0].rating)
    } else {
        return Number(sum(ratings, 'rating')) / Number(ratings.length)
    }
}
