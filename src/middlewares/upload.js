import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/film_covers')
    },
    filename: async function (req, file, cb) {
        const extension = path.extname(file.originalname)
        const name = crypto.randomBytes(16).toString('hex')
        cb(null, name + extension)
    }
})

export const upload = multer({storage: storage})