const mongoose = require('mongoose');
const bcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        console.log(user);
        if(user) {
            return res.status(409).json({message: 'Email is exists'})
        } else {
            bcypt.hash(req.body.password, 10).then(hash => {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                })
                
                user.save()
                .then(result => {
                    console.log(result);
                    return res.status(200).json({
                        message: 'User created'
                    });
                })
                .catch(err => res.status(500).json({error: err}));
            })
            .catch(err => res.status(500).json({error: err}));
        }
    })
    .catch(err => res.status(500).json({error: err}));
    
};

exports.user_signin = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: 'Auth failed'
            });
        }
        bcypt.compare(req.body.password, user.password)
        .then(result => {
            console.log(result);
            if(result) {
                const token = jwt.sign(
                    {
                        email: req.body.email,
                        userId: user._id,

                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Auth successful',
                    token
                })
            } else {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
        }).catch(error => res.status(401).json({
            message: 'Auth failed'
        }))
    })
    .catch(err => res.status(500).json({error: err}))
};

exports.user_delete = (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
    .then(result => {
        return res.status(200).json({message: "User deleted"})
    })
    .catch(err => res.status(500).json({error: err}));
};

