const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    department: String,
})
const Register = mongoose.model("Register", userSchema)
module.exports = Register