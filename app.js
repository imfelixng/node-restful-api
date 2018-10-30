const express = require('express');
const app = express();
const morgan = require('morgan');



const productRoutes = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');


app.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: 'It works'
        }
    );

});

app.use(morgan('dev'));

app.use('/products', productRoutes);
app.use('/orders', orderRouters);

const createLog = (req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; //status not method
    next(error);
}

//Handing error
app.use(createLog); //forword error

const handleLog = (error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
};

app.use(handleLog);
module.exports = app;