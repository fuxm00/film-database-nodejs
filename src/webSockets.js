import ejs from 'ejs'
import { WebSocketServer } from 'ws'
import {getFavouritesByUser} from "./db/favourites.js";

/** @type {Set<WebSocket>} */
const connections = new Set()

export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
        connections.add(ws)

        ws.on('close', () => {
            connections.delete(ws)
        })
    })
}

export const sendFavouriteFilmsToAll = async (userId) => {
    const films = await getFavouritesByUser(userId)

    const html = await ejs.renderFile('views/_favouriteFilms.ejs', {
        films,
    })

    for (const connection of connections) {
        const message = {
            type: 'favFilms',
            html,
        }

        const json = JSON.stringify(message)

        connection.send(json)
    }
}
