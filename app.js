require('dotenv').config() 
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override') 
const expressSanitizer = require('express-sanitizer')
const port = parseInt(process.env.DB_PORT)
app = express() 

// App Config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true }) 
mongoose.set('useFindAndModify', false)
app.set("view engine", "ejs") 
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))  
app.use(expressSanitizer()) 
app.use(methodOverride("_method")) 

// Mongoose/Model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}  
})
const Blog = mongoose.model("Blog", blogSchema)

// Restful Routes

// Index Route
app.get("/", (req, res) => {
    res.redirect("/blogs")  
})

app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log("ERROR")
        } else {
            res.render("index", {blogs: blogs}) 
        }
    }) 
})

// New Route
app.get("/blogs/new", (req, res) => {
    res.render("new") 
})

// Create Route
app.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render("new")
        } else {
            res.redirect("/blogs") 
        }
    })
})

// Show Route 
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("show", {blog: foundBlog}) 
        }
    })
})

// Edit Route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("edit", {blog: foundBlog}) 
        }
    })
})

// Update Route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id) 
        }
    })
})

// Delete Route 
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs") 
        }
    })
})

app.listen(port, () => {
    console.log("Server is Running...") 
})

