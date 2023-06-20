import express from "express";
import {getWatchedByUser} from "../db/watched.js";
import auth from "../middlewares/auth.js";

const stats = express.Router()

stats.get('/stats/', auth,  async (req, res, next) => {

    const user = res.locals.user

    const films = await getWatchedByUser(user.id)

    const minYear = Math.min(...films.map(film => film.year));
    const maxYear = Math.max(...films.map(film => film.year));

    const yearsRange = [];
    for (let year = minYear; year <= maxYear; year++) {
        yearsRange.push(year);
    }

    const yearCount = {};
    films.forEach(film => {
        const { year } = film;
        if (yearCount[year]) {
            yearCount[year]++;
        } else {
            yearCount[year] = 1;
        }
    });

    const chartData = yearsRange.map(year => ({
        year,
        count: yearCount[year] || 0,
    }));

    res.render('stats', {
        title: 'stats',
        marked: 'stats',
        chartData
    })

})

export default stats