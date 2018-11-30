const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
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
    
});

router.post('/signin', (req, res, next) => {

});

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
    .then(result => {
        return res.status(200).json({message: "User deleted"})
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;