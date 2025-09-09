
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import './App.css';

function App() {
  return (
    <div className="App">
      <header style={{padding: '20px', background: '#f5f5f5', textAlign: 'center'}}>
        <h1>Reddit App</h1>
      </header>
      <main style={{padding: '20px'}}>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;