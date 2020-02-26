const multer = require('multer');
const uuid4 = require('uuid/v4');

//比對minetype 檔案類型 , 作為對應的副檔名
const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};

let storage = multer.diskStorage({
    //搬移檔案
    destination: function (req, file, cb) {
        //(第一個參數是錯誤處理 , )
        cb(null, __dirname + '/../public/img-uploads')
    },

    //更改檔案名
    filename: function (req, file, cb) {
        let ext = extMap[file.mimetype];
        if (ext) {
            cb(null, uuid4() + ext);
        } else {
            cb(new Error('not allowed'));
        }
    }
});

let fileFilter = (req, file, cb) => {
    cb(null, !!extMap[file.mimetype]);
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;