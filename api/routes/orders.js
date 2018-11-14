const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    let order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: 'Order was created',
        order
    });
});

router.get('/:orderId', (req, res, next) => {
    let id = req.params.orderId;
    res.status(200).json({
        message: 'Order details',
        id
    });

});

router.patch('/:orderId', (req, res, next) => {
    let id = req.params.orderId;
    res.status(200).json({
        message: 'Updated order!',
        id
    });
});

router.delete('/:orderId', (req, res, next) => {
    let id = req.params.orderId;
    res.status(200).json({
        message: 'Deleted order!',
        id
    });
});

module.exports = router;