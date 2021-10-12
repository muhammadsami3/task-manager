const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, callback) {
        console.log(file);

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {

            return callback(new Error('pls upload an image'))

        }
        callback(undefined, true)
    }
})

const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    if (await User.doesExist(user.email)) {
        return res.status(400).send('user already exists')
    }


    try {
        await user.save()

        const token = user.getToken()

        res.status(201).send({ user, token })
    } catch (error) {

        res.status(400).send(error)
    }

})



router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

router.get('/users/login', async (req, res) => {
    try {

        const credentials = Object.keys(req.body)
        const credentialsKey = ['email', 'password']

        const isValidLogin = credentials.every((key) => credentialsKey.includes(key))

        console.log("isvalidcred", isValidLogin);

        if (!isValidLogin) return res.status(400).send("invalid credentials")

        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.getToken()

        res.send({ user, token })

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }

})

router.post('/user/logout', auth, async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        console.log(req.user.tokens);
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/user/logoutAll', auth, async (req, res) => {

    try {

        req.user.tokens = []
        console.log(req.user.tokens);
        await req.user.save()
        res.send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {


    try {
        await req.user.remove()
        res.send(req.user)

    } catch (error) {
        res.status(500).send(error)

    }

})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send("Invalid update")

    }

    try {

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)

    } catch (error) {
        res.status(500).send(e)

    }

})


router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
module.exports = router
module.exports = router