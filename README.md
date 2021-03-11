# Validation in Express

Docs: https://express-validator.github.io/docs/

.hbs loops through errors

# steps in routes.js 
include array in router.post (routes.js)

    router.post('/create-user', [
        ...
    ], (req, res) {

    });

to:

    router.post('/create-user', [
        check('name').notEmpty() 
    ], (req, res) {

    });

name comes from handlebar:

    <div class="form-group">
                        <label>Name</label>
                        <input type="text" class="form-control" name="name" />
    </div>

add .withMessage..

    router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required') 
    ], (req, res) {

    });

to avoid spaces (input from users) we use "sanitization chain" 
https://express-validator.github.io/docs/sanitization-chain-api.html
https://express-validator.github.io/docs/sanitization.html
we use .trim().escape(),  -> that is Sanitization

// quote
    const express = require('express');
    const { body } = require('express-validator');

    const app = express();
    app.use(express.json());

    app.post(
    '/comment',
    body('email').isEmail().normalizeEmail(),
    body('text').not().isEmpty().trim().escape(),
    body('notifyOnReply').toBoolean(),
    (req, res) => {
        // Handle the request somehow
    },
    );

    In the example above, we are validating email and text fields, so we may take advantage of the same chain to apply some sanitization, like e-mail normalization (normalizeEmail) and trimming (trim)/HTML escaping (escape).
    The notifyOnReply field isn't validated, but it can still make use of the same check function to convert it to a JavaScript boolean.
// end of quote

    router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required').trim().escape()
    ], (req, res) {

    });

with email check: 

    router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required').trim().escape(),
        check('email', 'Email is required').isEmail().normalizeEmail(),
    ], (req, res) {

    });

normalizeEmail() does trim and escape

add password length check:

    router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required').trim().escape(),
        check('email', 'Email is required').isEmail().normalizeEmail(),
        check('password', 'Password is required').isLength({min: 4})

    ], (req, res) {

    });

btw. strong pw check: https://github.com/validatorjs/validator.js -> goto isStrongPassword(str [, options])

last input box: (is pw same check): custom validators sanitizers
https://express-validator.github.io/docs/custom-validators-sanitizers.html


    router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required').trim().escape(),
        check('email', 'Email is required').isEmail().normalizeEmail(),
        check('password', 'Password is required').isLength({min: 4}).custom((val, {req}))  //  
    ], (req, res) {

if val of password is not confirmed..

        router.post('/create-user', [
        check('name').notEmpty().withMessage('Name is required').trim().escape(),
        check('email', 'Email is required').isEmail().normalizeEmail(),
        check('password', 'Password is required').isLength({min: 4}).custom((val, {req}) => {
            if(val !== req.body.confirm_password) {
                throw new Error('Password do not match!');
            } else {
                return val;
            }
        })
    ], (req, res) {

    });


comes from 

    <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" class="form-control" name="confirm_password" />
    </div>


next

    ], (req, res) {
        const errors = validationResult(req).array();
        if(errors) {
            res.redirect('/user');
        }
    });

/user comes later

    ], (req, res) => {
        const errors = validationResult(req).array();
        if(errors) {
            req.session.errors = errors;
            res.redirect('/user');
        } else {
            res.redirect('/');
        }
    });

next

    router.get('/user', function(req, res) {
        res.render('user', {errors: req.session.errors});
    });