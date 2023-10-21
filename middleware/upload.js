const multer = require("multer");

const storage = (location) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + `/../public/${location ? location : ""}`);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            cb(null, `${uniqueSuffix}-image-${file.originalname}`);
        }
    })
}

const imageFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb('Error, please upload an image file', false)
    }
}

const uploadFile = (location = null) => {
    return multer({ storage: storage(location) , fileFilter: imageFilter })
}

module.exports = uploadFile;