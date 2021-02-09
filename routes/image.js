const express = require('express');
const router = express.Router();

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  'public/images/') //경로
    },
    filename: function (req, file, cb) {
        cb (null,  file.originalname) //오리지널 파일 네임
    }
});
const upload = multer({storage:storage});
// 'IMG_FILE'
router.post('/save', upload.array('IMG_FILE'), (req, res, next) => {
    console.log("save!!!");
})

router.get('/view/:filename', () => {

})
module.exports = router;