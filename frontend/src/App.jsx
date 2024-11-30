import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';
import AddProduct from './components/AddProduct';


const App = () => {

  return (
   <>
   <Router>
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/AddProduct" element={<AddProduct/>} />
    </Routes>
   </Router>
</>
  );
};

export default App;