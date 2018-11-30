const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => { // /products
    //function select: định nghĩa các trường cần trả về cho client
    Product.find().select("_id name price productImage descriptionPhotos").then(docs => {
        
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    descriptionPhotos: doc.descriptionPhotos,
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
        return res.status(500).json({error: err});
    });
};

exports.products_create_product = (req, res, next) => { // /products
  
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.files.productImage && req.files.productImage[0].path,
        descriptionPhotos: req.files.descriptionPhotos && req.files.descriptionPhotos.map(photo => photo.path)
    });

    product.save().then(doc => {
        res.status(201).json({
            message: 'Created product successfully',
            createProduct: {
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage,
                descriptionPhotos: doc.descriptionPhotos,
                _id: doc._id,
                request: {
                    type: "GET",
                    url: "http://localhost:12345/products/" + doc._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        return res.status(200).json({error: err})
    });
};

exports.products_get_product = (req, res, next) => {
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
                return res.status(404).json({message: "No find product with ID = " + id});
            }
        }
    )
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: err})
    });
};

exports.products_update_product = (req, res, next) => {

    const id = req.params.productId;

    const updateOps = {};

    for(let propName in req.body) {
        updateOps[propName] = req.body[propName];
    }

    Product.updateOne({_id:id}, {$set: updateOps}).then(doc => {

        if(doc.n === 0) {
            return res.status(404).json({message: "Product not found"})
        }

        res.status(200).json({
            message: 'Product updated',
            request: {
               type: 'GET',
               url: "http://localhost:12345/products/" + id 
            }
        });
    }).catch(err => {
        return res.status(500).json({error: err})
    });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({_id: id}).then(doc => {
        console.log(doc.n);
        if(doc.n === 0) {
            return res.status(404).json({message: "Product not found"})
        }

        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: "http://localhost:12345/products",
                body: {
                    name: 'String',
                    price: 'Number',
                    productImage: 'File',
                    descriptionPhotos: 'Multiple file'
                }
            }
        });
    })
    .catch( err => {
        return res.status(500).json({error: err})
    });
};