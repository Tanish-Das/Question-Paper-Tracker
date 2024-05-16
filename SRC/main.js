const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const hbs = require("hbs")
const path = require("path")
const body_parser = require("body-parser")
require("../SRC/connecttomongodb")
const Register = require("../SRC/register")
const views_path = path.join(__dirname, "../templates")
const multer = require("multer")
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
// const upload = multer({dest: "QUESTION_PAPERS/"})
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './QUESTION_PAPER')
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`)
        const fpath= file.path
    }
})
const upload = multer({ storage: storage })
const renderTemplate = (res, templateName) => {
    res.render(templateName)
}

app.set("view engine", "hbs")
app.set("views", views_path)

app.listen(port, () => {
    console.log(`App running on port: ${port}`)
})

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/admin", (req, res) => {
    res.render("admin")
})

app.get("/faculty", (req, res) => {
    res.render("faculty")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/create_faculty", (req, res) => {
    res.render("create_faculty")
})
app.get("/upload_file", (req, res) => {
    res.render("upload_file")
})

app.post("/auth", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email === "hod.adamas@gmail.com" && password === "hod1234") {
        res.render("login")
    } else {
        res.render("failed")
    }
})
app.post("/auth2", async (req, res) => {
    const { email, password } = req.body
    const count = await Register.find({ email }).countDocuments()
    if (count === 0) {
        res.render("failed")
    } else {
        const data = await Register.findOne({ email, password })
        if (data) {
            res.render("upload_file")
        } else {
            res.render("failed")
        }
    }
})

app.post("/admin/create-faculty", async (req, res) => {
    const { name, email, password, department } = req.body
    const newFaculty = new Register({ name, email, password, department })
    const result = await newFaculty.save()
    res.render("created")
})

app.get("/upload_file", (req, res) => {
    res.render("upload_file")
})
app.post("/upload_file", upload.single("file"), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    return res.send("FILE UPLOADED")
})
app.get("/admin_table", async (req, res) => {
    const data = await Register.find({}, 'name email department').lean()
    res.render("admin_table", { data })
})
const fs = require("fs")
const Handlebars= require("handlebars")
app.engine('hbs', (path, options, callback) => {
    const template = Handlebars.compile(fs.readFileSync(path, 'utf-8'))
    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    })
    callback(null, template(options))
})
app.get("/admin_table", async (req, res) => {
    res.render("admin_table", { data: dataWithFileExists })
});


