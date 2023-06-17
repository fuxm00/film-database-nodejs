import db from "../db.js";
import {currentDate} from "../utils/date.js";

export const createComment = async (userId, filmId, text) => {
    await db('comments').insert( {userId: userId, filmId: filmId, text:text, created: currentDate()})
}

export const getCommentsByFilm = async (filmId, limit) => {
    let query =  db('comments').select('*').where('filmId', filmId)
        .leftJoin('users', 'comments.userId', 'users.id')
        .orderBy('id', 'desc')

    if (limit) {
        query.limit(limit)
    }

    const comments = await query

    return comments


}