const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const blogPostsArray = require('./data');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

const mongo_url = process.env.mongo_url ;

mongoose.connect(mongo_url)
.then( ()=>{
    console.log("Database connected successfully");
})
.catch( (err)=>{
    console.log("Error ocurred at db connection", err);
});

const blogSchema = new mongoose.Schema({
    title : String,
    imgURL : String,
    description : String
});

const Blog = new mongoose.model("blog", blogSchema)

app.get('/', (req, res)=>{
   
    //  blogPostsArray.forEach((post)=>{
    //     res.render('index' , {
    //         imageURL: post.imageURL, 
    //         title: post.title, 
    //         description: post.description
    //     })
    //  })


    Blog.find({})
    .then( (arr)=>{
        res.render('index',{blogPostsArray : arr});
    })
    .catch( (err)=>{
        console.log("Cannot find blog");
        res.render("404");
    });

    // res.render('index',{blogPostsArray})
    
    // res.sendFile(__dirname + '/index.html');
    // console.log(__dirname );
});

app.get('/contact' ,(req, res)=>{
    res.render('contact');
});

app.get('/about' ,(req, res)=>{
    res.render('about');
});

app.get('/compose', (req, res)=>{
    res.render('compose');
    // console.log(__dirname );
});

app.post('/compose', (req, res)=>{
    // console.log(req.body);
    // const newId = blogPostsArray.length + 1 ;
    const image = req.body.imageUrl;
    const title = req.body.title;
    const description = req.body.description;

    const newBlog = new Blog({
        imageURL : image,
        title : title,
        description : description
    });

    newBlog.save().then( ()=>{
        console.log("Blog posted successfully");
    })
    .catch( (err)=>{
        console.log("Error ocurred at posting new blog");
    });

    // blogPostsArray.push(obj);

    res.redirect('/');
});

app.get('/post/:id', (req, res)=>{
    console.log(req.params.id);

    var id = req.params.id;
    var title = "";
    var imageURL = "";
    var description = "";

    blogPostsArray.forEach(post => {
        if (post._id == id){
            imageURL = post.imageURL;
            title = post.title;
            description = post.description;

        }
    });

    const post = {
        imageURL : imageURL,
        title : title,
        description : description,
    }

    res.render('post' , {post});
    // console.log(__dirname );
});

const port = 3000 || process.env.PORT; 

app.listen(port , ()=>{
    console.log('server is listening at port 3000');
});
