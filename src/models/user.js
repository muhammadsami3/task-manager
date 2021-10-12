const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'mysecret'

const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {


            if (value.toLowerCase().includes("password")) {
                throw new Error("password must be complex")

            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error("Email is invalid")
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("age must be a positive number")
            }

        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

}, { timestamps: true 
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {

    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens


    return userObject
}


userSchema.methods.getToken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()

    console.log(token);
    return token
}
userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if (!user) throw new Error('email not found')

    console.log("user.password", user.password, password);

    const isValidPassword = bcrypt.compareSync(password, user.password)

    console.log(isValidPassword);

    if (!isValidPassword) throw new Error("invalid email or password")

    return user
}

userSchema.statics.doesExist = async (email) => {

    const user = await User.findOne({ email })

    return !!user
}

userSchema.pre('save', async function (next) {

    const user = this
    console.log("before saving ");

    if (user.isModified('password')) {

        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    }

    next()

})

userSchema.pre('remove', async function (next) {

    const user = this
    console.log("before delete");

    await Task.deleteMany({ owner: user._id })


    next()

})

const User = mongoose.model('User', userSchema)

module.exports = User