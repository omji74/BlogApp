import React from 'react';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import AddBlog from './components/AddBlog'
import AllBlog from './components/AllBlog'

const router =  createBrowserRouter([
  {
    path:'/blogs',
    element:<AllBlog></AllBlog>
  },
 
  {
    path:'/addblog',
    element:<AddBlog></AddBlog>

  }
 
])

function App() {
  return (
   <main>
    <RouterProvider router = {router}></RouterProvider>
   </main>
  );
}

export default App;
