const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/faculty_details")
    .then(() => {
        console.log("Connected!")
    })
    .catch((e) => {
        console.log(e)
    })