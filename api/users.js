const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please inlude a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { name, email, password } = req.body

    try {
        // see if the user exists
        let user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }        
        // get users avatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({ name, email, avatar, password  })
        // encrypt password
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

        // return jsonwebtoken
        const payload = {
            user: {id: user._id}
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: '30d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token })
            }
        )

    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})



module.exports = router;