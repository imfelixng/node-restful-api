const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const Product = require('../models/product');


router.get('/', (req, res, next) => { // /products
    
    Product.find().then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req, res, next) => { // /products
    
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(doc => {
        console.log(doc);
        res.status(201).json({
            message: 'Handing POST requests to /products',
            createProduct: product
        });
    }).catch(err => {
        console.log(err);
        res.status(200).json({error: err})
    });

    
});

router.get('/:productId', (req, res, next) => {
    let id = req.params.productId;
    Product.findById(id).then(
        doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
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
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err})
    });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id}).then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({error: err})
    });
});

module.exports = router;