import './App.css';
import Category from './components/category';
import Main from './components/main';
import {BrowserRouter, Route,  Routes } from "react-router-dom";



function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}/>
          <Route path="/category" element={<Category />}/>
        </Routes>
        </BrowserRouter>
 
);
}

export default App;
