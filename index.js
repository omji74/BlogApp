const express = require('express');
const mongoose =  require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
mongoose.connect("mongodb://localhost:27017/BlogApp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db = mongoose.connection;


db.on("error",(error)=>{
    console.error("error occur ",error);

});
db.once("open",()=>{
    console.log("DB Connection successful");

})
const blogSchema  = new mongoose.Schema({
    title:{type:String,required:true},
    content:{
        type:String,required:true
    }
})
const Blog = new mongoose.model("Blog",blogSchema)


app.get('/',(req,res)=>{
        res.send("<h1>HII this is omji </h1>")
})

app.post('/addblog',async(req,res)=>{
    const {title,content} = req.body;
    try{
        const newBlog = new Blog({
            title,content
        });
        await  newBlog.save();
        console.log("blog save successfully");
        res.status(201);


    }
    catch(err){
        console.error("ooh error",err);
        res.status(500);

    }
})
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find(); // Fetch all blogs from the database

        if (blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found' });
        }

        res.json(blogs); // Send the fetched blogs as JSON response
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.listen(5000,()=>{
    console.log("on port 5000");

})