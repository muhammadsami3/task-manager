const express = require('express')
require("./db/mongoose")

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const app = express()

const PORT = process.env.PORT || 3000

// configure express to parse json for us to object
app.use(express.json())

// middleware function
app.use((req, res, next) => {
    console.log(req.method, req.path)
    next()

})
app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, () => {
    console.log("Server is up and running on port:" + PORT);
})


const User = require('./models/user')

const main = async () => {



}