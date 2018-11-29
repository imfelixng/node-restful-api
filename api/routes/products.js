const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const multer = require("multer");

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

const Product = require('../models/product');


router.get('/', (req, res, next) => { // /products
    //function select: định nghĩa các trường cần trả về cho client
    Product.find().select("_id name price productImage").then(docs => {
        
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:12345/products/" + doc._id
                    }
                }
            })
        }

        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', upload.single('productImage') ,(req, res, next) => { // /products
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(doc => {
        res.status(201).json({
            message: 'Created product successfully',
            createProduct: {
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:12345/products/" + doc._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(200).json({error: err})
    });

    
});

router.get('/:productId', (req, res, next) => {
    let id = req.params.productId;
    Product.findById(id).select("name price _id productImage").then(
        doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: "http://localhost:12345/products/" + doc._id
                    }
                });
            } else {
                res.status(404).json({message: "No find product with ID = " + id});
            }
        }
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

//put: all resource
//patch: a part of resource

router.patch('/:productId', (req, res, next) => {

    const id = req.params.productId;

    const updateOps = {};

    for(let propName in req.body) {
        updateOps[propName] = req.body[propName];
    }

    Product.updateOne({_id:id}, {$set: updateOps}).then(doc => {
        res.status(200).json({
            message: 'Product updated',
            request: {
               type: 'GET',
               url: "http://localhost:12345/products/" + id 
            }
        });
    }).catch(err => {
        res.status(500).json({error: err})
    });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).then(doc => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: "http://localhost:12345/products",
                body: {
                    name: 'String',
                    price: 'Number',
                    productImage: 'String'
                }
            }
        });
    })
    .catch( err => {
        res.status(500).json({error: err})
    });
});

module.exports = router;