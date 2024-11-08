import { app } from './src/app.js'
import {createWebSocketServer} from "./src/webSockets.js";

const port = 3000

const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})

createWebSocketServer(server)
