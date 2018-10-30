const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');


app.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: 'It works'
        }
    );

});

app.use('/products', productRoutes);
app.use('/orders', orderRouters);

module.exports = app;