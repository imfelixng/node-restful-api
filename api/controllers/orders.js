const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

//exports.abc = module.exports = { abc: ....}
exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select("_id product quantity")
    .populate('product', 'name')
    .then(orders => {

        const response = {
            count: orders.length,
            orders: orders.map(order => {
                return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:12345/orders/' + order._id
                        }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err => res.status(500).json({error: err}))
};

exports.orders_create_order = (req, res, next) => {
    console.log(req.body.productId);
    Product.findById(req.body.productId).select("_id name price")
    .then(product => {
        if(!product) return res.status(404).json({
            message: "Product not found"
        });
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: product,
            quantity: req.body.quantity
        });
        return order.save();
    })
    .then(result => {
        return res.status(200).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:12345/orders/' + result._id
                }
            }
        })
    })
    .catch(err => res.status(500).json({error: err}));

};

exports.orders_get_order = (req, res, next) => {
    let orderId = req.params.orderId;

    Order.findById(orderId)
    .select("_id product quantity")
    .populate('product', 'name')
    .then(order => {
        if(order) {
            return res.status(200).json({
                order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:12345/orders/' + order._id
                }
            });
        }
        
        return res.status(404).json({message: "No find order with ID = " + orderId});
        
    }).catch(err => res.status(500).json({error: err}));
};

exports.orders_delete_order = (req, res, next) => {
    let id = req.params.orderId;
    
    Order.deleteOne({_id: id})
    .then(order => {

        if(order.n === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order deleted",
            request: {
                type: 'POST',
                url: 'http://localhost:12345/orders',
                body: {
                    productId: 'String',
                    quantity: Number
                }
            }
        })
    })
    .catch(err => res.status(500).json({error: err}));
};