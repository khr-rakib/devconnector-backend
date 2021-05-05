const router = require('express').Router()
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const { check, validationResult } = require('express-validator')


router.post('/', auth, 
    check('text', 'Text is required').notEmpty()
, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        
        const post = await newPost.save()
        res.json(post)
    } catch (error) {
        console.log(error)
        return res.status(500).send('server error')
    }
})


// get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts)
    } catch (error) {
        console.log(error)
        return res.status(500).send('server error')
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.json(post)
    } catch (error) {
        console.log(error)
        if (error.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('server error')
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"})
        }
        await post.remove()
        res.json({msg: 'Post removed'})
    } catch (error) {
        console.log(error)
        if (error.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' })
        }
        return res.status(500).send('server error')
    }
})


router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.some((like) => like.user.toString() == req.user.id)) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unShift({user: req.user.id})
        await post.save()
        res.json(post.likes)
    } catch (error) {
        console.log(error)
        return res.status(500).send('server error')
    }
})


// comments
router.post('/comment/:id', auth, 
    check('text', 'Text is required').notEmpty()
, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }
        
        post.comments.unShift(newComment)
        await post.save()
        res.json(post.comments)
    } catch (error) {
        console.log(error)
        return res.status(500).send('server error')
    }
})


router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});


module.exports = router;