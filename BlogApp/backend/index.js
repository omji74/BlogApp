const express = require('express');
const mongoose =  require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
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



app.post('/addblog', async (req, res) => {
    const { title, content } = req.body;
    try {
      const newBlog = new Blog({
        title,
        content,
      });
      await newBlog.save();
      console.log("Blog saved successfully");
      res.status(201).send({ message: 'Blog added successfully!' }); // Send a response body
    } catch (err) {
      console.error("Error saving blog:", err);
      res.status(500).send({ message: 'An error occurred while adding the blog.' }); // Send a response body
    }
  });


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
app.patch('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Validate the updated data if necessary (e.g., ensure required fields are present)

        const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog updated successfully', blog });
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Blog.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(5000,()=>{
    console.log("on port 5000");

})