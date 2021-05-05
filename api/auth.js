const { check, validationResult } = require('express-validator')
const router = require('express').Router()
const auth = require('../middlewares/auth')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('server error')
    }
})

router.post('/', [
    check('email', 'Please inlude a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body

    try {
        // see if the user exists
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
        }
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