const express = require('express');
const router = express.Router();

// middleware fuctions
const { check, validationResult } = require('express-validator');


router.post('/create-user', [
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
    check('email', 'Email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required (min lenght: 4)').isLength({min: 4}).custom((val, {req}) => {
        if(val !== req.body.confirm_password) {
            throw new Error('Password do not match!');
        } else {
            return val;
        }
    })
], (req, res) => {
    const errors = validationResult(req).array();
    if(errors) {
        req.session.errors = errors;
        res.redirect('/user');
    } else {
        res.redirect('/');
    }
});

router.get('/user', function(req, res) {
    res.render('user', {errors: req.session.errors});
});

router.get('/', function(req, res) {
    res.render('user');
    
});


module.exports = router;