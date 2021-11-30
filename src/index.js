const express = require('express')
require("./db/mongoose")

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const app = express()


const PORT = process.env.PORT
// configure express to parse json for us to object
app.use(express.json())

app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, () => {
    console.log("Server is up and running on port:" + PORT);
})


