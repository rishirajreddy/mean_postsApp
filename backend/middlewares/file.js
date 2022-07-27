const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = Error("Invalid mime type")
        if(isValid){
            error = "";
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const extension = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+ "-"+ Date.now() + "."+ extension);
    }
})

module.exports = multer({storage:storage}).single("image");