const express = require('express');
const router = express.Router();
const multer = require("multer");
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "_" + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    //check kieu file gui len
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error("Error mime type of file"), false);
    }
}

const upload = multer({
    storage,
    limits: 1024 * 1024 * 5, //check kich thuoc fiel gui len
    fileFilter
});

const ProductsController = require('../controllers/products');

router.get('/', ProductsController.products_get_all);

//do multer nên để sau upload để nhận lại các trường trong body nếu gửi token bằng body
//để trước upload nếu gửi token bằng header.authorization 
router.post('/', 
            checkAuth, 
            upload.fields([
                {name: 'productImage'},
                {name: 'descriptionPhotos'}
            ]), 
            ProductsController.products_create_product
            );

router.get('/:productId', ProductsController.products_get_product);

//put: all resource
//patch: a part of resource
router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;