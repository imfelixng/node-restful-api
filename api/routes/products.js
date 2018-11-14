const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => { // /products
    res.status(200).json({
        message: 'Handing GET requests to /products'
    });
});

router.post('/', (req, res, next) => { // /products
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    console.log(product);
    res.status(201).json({
        message: 'Handing POST requests to /products',
        createProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    let id = req.params.productId;
    if(id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID: ',
            id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id
        });
    }

});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product!'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product!'
    });
});

module.exports = router;