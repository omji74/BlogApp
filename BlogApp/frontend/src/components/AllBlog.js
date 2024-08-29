import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Typography,Card, CardContent, CircularProgress, Container, Alert, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField} from '@mui/material';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/blogs');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('An error occurred while fetching blogs.');
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleOpenDialog = (blog) => {
    setSelectedBlog(blog);
    setEditTitle(blog.title);
    setEditContent(blog.content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBlog(null);
  };

  const handleEdit = async () => {
    try {
      await axios.patch(`http://localhost:5000/blogs/${selectedBlog._id}`, {
        title: editTitle,
        content: editContent
      });
      setBlogs(blogs.map(blog => blog._id === selectedBlog._id ? { ...blog, title: editTitle, content: editContent } : blog));
      handleCloseDialog();
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('An error occurred while updating the blog.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/blogs/${selectedBlog._id}`);
      
      setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id));
      handleCloseDialog();
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('An error occurred while deleting the blog.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (blogs.length === 0) {
    return <Typography>No blogs found</Typography>;
  }

  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Blog List   </Typography>
      {blogs.map((blog) => (
        <Card key={blog._id} variant="outlined" style={{ marginBottom: '16px' }} onClick={() => handleOpenDialog(blog)}>
          <CardContent>
            <Typography variant="h5">{blog.title}</Typography>
            <Typography variant="body2">{blog.content}</Typography>
          </CardContent>
        </Card>
      ))}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Blog Details</DialogTitle>
        <DialogContent>
          {selectedBlog && (
            <>
              <TextField
                label="Title"
                fullWidth
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={4}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleEdit} color="primary">Edit</Button>
          <Button onClick={handleDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogList;
