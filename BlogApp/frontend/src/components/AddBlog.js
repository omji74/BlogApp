import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const AddBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !content) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/addblog', { title, content });
      console.log(response);

      if (response.status === 201) {
        setSuccessMessage('Blog added successfully!');
        setTitle('');
        setContent(''); 
        setErrorMessage(null);
      } else {
        setErrorMessage('An error occurred while adding the blog.');
      }
    } catch (error) {
      console.error('Error adding blog:', error);
      setErrorMessage('An error occurred while adding the blog.');
    }
  };

  return (
    <div>
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Blog Content"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Add Blog
        </Button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddBlog;
