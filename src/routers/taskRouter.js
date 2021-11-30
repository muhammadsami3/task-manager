const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

const Task = require('../models/task')



router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })


    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {

        res.status(400).send(error)
    }

})

// tasks?completed=true
// tasks?sortedBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const options = {}
    const sort = {}
    const completed = req.query.completed

    if (completed) {

        if (completed === 'true' || completed === 'false') {
            match.completed = completed === 'true'

        } else {
            return res.status(400).send(`invalid parameter value completed = ${completed}`)
        }
    }


    try {

        if (req.query.limit) {
            options.limit = parseInt(req.query.limit)
        }

        if (req.query.skip) {
            options.skip = parseInt(req.query.skip)
        }

        if (req.query.sortBy) {
            const sortByParts = req.query.sortBy.split(':')
            sort[sortByParts[0]] = sortByParts[1] === 'desc' ? -1 : 1
            options.sort = sort
        }


        await req.user.populate({
            path: 'tasks',
            match,
            options
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {

        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })  
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {

        res.status(500).send(error)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {

        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

})


router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send("invalid update")

    }

    const _id = req.params.id

    try {

        let task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

})
module.exports = router