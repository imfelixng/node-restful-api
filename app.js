const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');

app.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: 'It works'
        }
    );

});

app.use('/products', productRoutes);

module.exports = app;