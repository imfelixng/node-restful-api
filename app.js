const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const mongoUrl = require('./api/configs/keys').mongoUrl;

const productRoutes = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');

mongoose.connect(
    mongoUrl, 
    {
        useNewUrlParser: true,
    }, 
    (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log("connect mongodb success");
});

app.get('/', (req, res, next) => {
    res.status(200).json(
        {
            message: 'It works'
        }
    );

});

app.use(morgan('dev'));
//set prefix ở path có thể truy cập toàn bộ file trong upload
app.use('/uploads', express.static("uploads"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// let whitelist = ['http://localhost:3000'];

// let corsOptions = {
//     origin: (origin, callback) => {
//         if(whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }

//use external module cors
app.use(cors());

//CORS not use external module
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers', 
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
//         return res.status(200).json({});
//     }
//     next();
// });

app.use('/products', productRoutes);
app.use('/orders', orderRouters);

const createLog = (req, res, next) => {
    const error = new Error('Not found');
    error.status = 404; //status not method
    next(error);
}

//Handing error
app.use(createLog); //forward error

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